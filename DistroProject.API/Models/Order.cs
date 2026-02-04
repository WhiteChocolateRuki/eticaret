using System.ComponentModel.DataAnnotations;

namespace DistroProject.API.Models;

public class Order
{
    public int Id { get; set; }
    
    [Required]
    public int ProductId { get; set; } // Hangi ürün sipariş edildi?
    public Product? Product { get; set; } // Ürün detaylarına ulaşmak için

    [Required]
    public int CustomerId { get; set; } // Siparişi hangi müşteri verdi?
    public User? Customer { get; set; }

    public int Quantity { get; set; } // Kaç adet?
    public decimal TotalPrice { get; set; } // Toplam tutar
    
    public string Status { get; set; } = "Pending"; // Pending, Approved, Shipped, Delivered
    public DateTime OrderDate { get; set; } = DateTime.Now;

    // Lojistik kısmı için:
    public int? DriverId { get; set; } // Bu siparişi hangi şoför teslim edecek?
    public User? Driver { get; set; }

    public int DeliveredQuantity { get; set; } // Şoförün gerçekten teslim ettiği miktar
}