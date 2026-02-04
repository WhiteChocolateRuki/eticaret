using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DistroProject.API.Data;
using DistroProject.API.Models;
using System.Security.Claims;

namespace DistroProject.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize] // Sisteme girmeyen sipariş sistemine dokunamaz!
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // 1. Sipariş Oluştur (Herkes - Müşteriler)
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(Order order)
    {
        // Siparişi veren kişinin ID'sini token'dan çekiyoruz
        var userId = User.FindFirst("userId")?.Value;
        if (userId != null) order.CustomerId = int.Parse(userId);

        // Ürün fiyatını çekip toplam tutarı hesaplayalım
        var product = await _context.Products.FindAsync(order.ProductId);
        if (product == null) return BadRequest("Ürün bulunamadı!");

        order.TotalPrice = product.Price * order.Quantity;
        order.OrderDate = DateTime.Now;
        order.Status = "Pending"; // Onay bekliyor

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return Ok(order);
    }

    // 2. Bekleyen Siparişleri Gör (Sadece Admin)
    [HttpGet("pending")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Order>>> GetPendingOrders()
    {
        return await _context.Orders
            .Include(o => o.Product)
            .Include(o => o.Customer)
            .Where(o => o.Status == "Pending")
            .ToListAsync();
    }

    // 3. Siparişi Şoföre Ata (Sadece Admin)
    [HttpPut("assign-driver/{orderId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignDriver(int orderId, int driverId)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null) return NotFound();

        order.DriverId = driverId;
        order.Status = "Shipped"; // Yola çıktı

        await _context.SaveChangesAsync();
        return Ok(new { message = "Sipariş şoföre atandı ve yola çıktı!" });
    }

    // 4. Şoförün Kendi Teslimat Listesi (Sadece Driver)
    [HttpGet("my-deliveries")]
    [Authorize(Roles = "Driver")]
    public async Task<ActionResult<IEnumerable<Order>>> GetMyDeliveries()
    {
        var driverId = User.FindFirst("userId")?.Value;
        return await _context.Orders
            .Include(o => o.Product)
            .Where(o => o.DriverId == int.Parse(driverId!) && o.Status == "Shipped")
            .ToListAsync();
    }

    // 5. Siparişi Teslim Et ve Stoktan Düş (Sadece Driver)
[HttpPut("deliver-order/{orderId}")]
[Authorize(Roles = "Driver")]
public async Task<IActionResult> DeliverOrder(int orderId, [FromQuery] int actualDeliveredQuantity)
{
    // 1. Siparişi ve Ürünü bul
    var order = await _context.Orders.Include(o => o.Product).FirstOrDefaultAsync(o => o.Id == orderId);
    
    if (order == null) return NotFound("Sipariş bulunamadı!");
    if (order.Status != "Shipped") return BadRequest("Sipariş teslimat aşamasında değil!");

    // 2. Miktar Kontrolü
    if (actualDeliveredQuantity > order.Quantity)
        return BadRequest("Sipariş edilenden daha fazla ürün teslim edilemez!");

    // 3. Teslim Edilen Miktarı Kaydet
    order.DeliveredQuantity = actualDeliveredQuantity;

    // 4. Stoktan Gerçek Teslim Edilen Kadar Düş
    if (order.Product != null)
    {
        if (order.Product.Stock < actualDeliveredQuantity)
            return BadRequest("Yetersiz stok!");
            
        order.Product.Stock -= actualDeliveredQuantity;
    }

    // 5. Durumu Belirle (Fark varsa Partial, yoksa Delivered)
    if (actualDeliveredQuantity < order.Quantity)
    {
        order.Status = "PartialDelivered"; // Kısmi Teslimat
    }
    else
    {
        order.Status = "Delivered"; // Tam Teslimat
    }

    await _context.SaveChangesAsync();

    return Ok(new { 
        message = order.Status == "PartialDelivered" 
            ? $"Eksik teslimat yapıldı: {order.Quantity - actualDeliveredQuantity} adet eksik." 
            : "Sipariş tam olarak teslim edildi.",
        status = order.Status,
        kalanStok = order.Product?.Stock 
    });
}
}