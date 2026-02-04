using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DistroProject.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDeliveredQuantity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeliveredQuantity",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeliveredQuantity",
                table: "Orders");
        }
    }
}
