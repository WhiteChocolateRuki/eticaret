using System.Text.Json.Serialization;

namespace DistroProject.API.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    [JsonIgnore] // Prevent cycle during serialization
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
