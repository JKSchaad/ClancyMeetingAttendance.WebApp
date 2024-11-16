using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ClancyMeetingAttendance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private const string TestEmail = "admin@example.com";
        private const string TestPassword = "admin123";

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public class LoginRequest
        {
            public required string Email { get; set; }
            public required string Password { get; set; }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                // For testing purposes, using hardcoded credentials
                if (request.Email == TestEmail && request.Password == TestPassword)
                {
                    var token = GenerateJwtToken(request.Email, "admin");

                    return Ok(new
                    {
                        token = token,
                        role = "admin"
                    });
                }

                return Unauthorized(new { message = "Invalid email or password" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }

        private string GenerateJwtToken(string email, string role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "your-256-bit-secret"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "clancy-meeting-attendance",
                audience: _configuration["Jwt:Audience"] ?? "clancy-meeting-attendance",
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
