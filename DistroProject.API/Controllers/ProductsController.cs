using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; // 1. Added this library
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

    // Everyone can see products (Customers, Drivers, etc.)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products.ToListAsync();
    }

    // ONLY ADMINS CAN ADD PRODUCTS
    [HttpPost]
    [Authorize(Roles = "Admin")] // 2. Locked the door: Only "Admin" role can enter
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok(product);
    }
}