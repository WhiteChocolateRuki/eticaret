using System.ComponentModel.DataAnnotations.Schema;

namespace DistroProject.API.Models;

public class Product
{
    public int Id { get; set; } // Birincil Anahtar (Primary Key)
    
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")] // Fiyat hassasiyeti uyarısını çözmek için
    public decimal Price { get; set; }

    public string UnitType { get; set; } = "Adet"; // Kg, Litre, Adet

    public int Stock { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}