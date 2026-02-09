using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; // 1. Added this library
using DistroProject.API.Data;
using DistroProject.API.Models;
using DistroProject.API.DTOs;

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
        return await _context.Products.Include(p => p.Categories).ToListAsync();
    }

    // ONLY ADMINS CAN ADD PRODUCTS
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Product>> PostProduct([FromForm] DTOs.ProductUploadDto productDto)
    {
        var product = new Product
        {
            Name = productDto.Name,
            Price = productDto.Price,
            UnitType = productDto.UnitType,
            Stock = productDto.Stock,
            IsActive = true,
            CreatedAt = DateTime.Now
        };

        if (productDto.CategoryIds != null && productDto.CategoryIds.Count > 0)
        {
            var categories = await _context.Categories
                .Where(c => productDto.CategoryIds.Contains(c.Id))
                .ToListAsync();

            foreach (var category in categories)
            {
                product.Categories.Add(category);
            }
        }

        if (productDto.ImageFile != null && productDto.ImageFile.Length > 0)
        {
            using (var memoryStream = new MemoryStream())
            {
                await productDto.ImageFile.CopyToAsync(memoryStream);
                product.Image = memoryStream.ToArray();
                product.ImageContentType = productDto.ImageFile.ContentType;
            }
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok(product);
    }
}