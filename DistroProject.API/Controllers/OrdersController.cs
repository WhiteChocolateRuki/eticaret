using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DistroProject.API.Data;
using DistroProject.API.Models;
using System.Security.Claims;

namespace DistroProject.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize] // Only authenticated users can access the order system!
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // 1. Create Order (Everyone - Customers)
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(Order order)
    {
        // Get the user ID from the token
        var userId = User.FindFirst("userId")?.Value;
        if (userId != null) order.CustomerId = int.Parse(userId);

        // Get product price and calculate total amount
        var product = await _context.Products.FindAsync(order.ProductId);
        if (product == null) return BadRequest("Product not found!");

        order.TotalPrice = product.Price * order.Quantity;
        order.OrderDate = DateTime.Now;
        order.Status = "Pending"; // Waiting for approval

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return Ok(order);
    }

    // 2. See Pending Orders (Admin Only)
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

    // 3. Assign Order to Driver (Admin Only)
    [HttpPut("assign-driver/{orderId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignDriver(int orderId, int driverId)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null) return NotFound();

        order.DriverId = driverId;
        order.Status = "Shipped"; // Shipped

        await _context.SaveChangesAsync();
        return Ok(new { message = "Order assigned to driver and shipped!" });
    }

    // 4. Driver's Own Delivery List (Driver Only)
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

    // 5. Deliver Order and Deduct from Stock (Driver Only)
[HttpPut("deliver-order/{orderId}")]
[Authorize(Roles = "Driver")]
public async Task<IActionResult> DeliverOrder(int orderId, [FromQuery] int actualDeliveredQuantity)
{
    // 1. Find Order and Product
    var order = await _context.Orders.Include(o => o.Product).FirstOrDefaultAsync(o => o.Id == orderId);
    
    if (order == null) return NotFound("Order not found!");
    if (order.Status != "Shipped") return BadRequest("Order is not in shipping stage!");

    // 2. Quantity Check
    if (actualDeliveredQuantity > order.Quantity)
        return BadRequest("Cannot deliver more items than ordered!");

    // 3. Save Delivered Quantity
    order.DeliveredQuantity = actualDeliveredQuantity;

    // 4. Deduct Actual Delivered Quantity from Stock
    if (order.Product != null)
    {
        if (order.Product.Stock < actualDeliveredQuantity)
            return BadRequest("Insufficient stock!");
            
        order.Product.Stock -= actualDeliveredQuantity;
    }

    // 5. Determine Status (Partial if difference exists, otherwise Delivered)
    if (actualDeliveredQuantity < order.Quantity)
    {
        order.Status = "PartialDelivered"; // Partial Delivery
    }
    else
    {
        order.Status = "Delivered"; // Full Delivery
    }

    await _context.SaveChangesAsync();

    return Ok(new { 
        message = order.Status == "PartialDelivered" 
            ? $"Partial delivery made: {order.Quantity - actualDeliveredQuantity} items missing." 
            : "Order delivered successfully.",
        status = order.Status,
        kalanStok = order.Product?.Stock 
    });
}
}