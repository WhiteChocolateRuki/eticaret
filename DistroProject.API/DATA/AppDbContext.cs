using Microsoft.EntityFrameworkCore;
using DistroProject.API.Models;

namespace DistroProject.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    
    // THIS WAS THE MISSING LINE:
    public DbSet<User> Users { get; set; } 
    public DbSet<Order> Orders { get; set; }
}