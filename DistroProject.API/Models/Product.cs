using System.ComponentModel.DataAnnotations.Schema;

namespace DistroProject.API.Models;

public class Product
{
    public int Id { get; set; } // Primary Key
    
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")] // To resolve precision warning
    public decimal Price { get; set; }

    public string UnitType { get; set; } = "Piece"; // Kg, Liter, Piece

    public int Stock { get; set; }

    public bool IsActive { get; set; } = true;

    [Column(TypeName = "varbinary(MAX)")] // Explicit definition for large images
    public byte[]? Image { get; set; }

    public string? ImageContentType { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}