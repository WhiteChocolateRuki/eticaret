using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DistroProject.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProductImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.AddColumn<byte[]>(
            //     name: "Image",
            //     table: "Products",
            //     type: "varbinary(MAX)",
            //     nullable: true);

            // migrationBuilder.AddColumn<string>(
            //     name: "ImageContentType",
            //     table: "Products",
            //     type: "nvarchar(max)",
            //     nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DropColumn(
            //     name: "Image",
            //     table: "Products");

            // migrationBuilder.DropColumn(
            //     name: "ImageContentType",
            //     table: "Products");
        }
    }
}
