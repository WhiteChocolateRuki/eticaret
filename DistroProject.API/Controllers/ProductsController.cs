using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; // 1. Bu kütüphaneyi ekledik
using DistroProject.API.Data;
using DistroProject.API.Models;

namespace DistroProject.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // Herkes ürünleri görebilir (Müşteriler, Şoförler vb.)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products.ToListAsync();
    }

    // SADECE ADMİNLER ÜRÜN EKLEYEBİLİR
    [HttpPost]
    [Authorize(Roles = "Admin")] // 2. Kapıyı kilitledik: Sadece "Admin" rolü olanlar girebilir
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok(product);
    }
}