using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using System.ComponentModel.DataAnnotations;

namespace ClancyMeetingAttendance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
// Temporarily disable authorization for testing
// [Authorize]
public class UsersController : ControllerBase
{
    private static readonly string _dataFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "users.json");
    private static readonly object _fileLock = new object();
    private static List<User> _users = LoadUsers();

    private static List<User> LoadUsers()
    {
        lock (_fileLock)
        {
            if (!System.IO.File.Exists(_dataFilePath))
            {
                var defaultUsers = new List<User>
                {
                    new User
                    {
                        Id = "1",
                        FirstName = "John",
                        LastName = "Doe",
                        Email = "john.doe@example.com",
                        PhoneNumber = "1234567890",
                        Role = "user",
                        CreatedAt = DateTime.UtcNow.AddDays(-30)
                    },
                    new User
                    {
                        Id = "2",
                        FirstName = "Jane",
                        LastName = "Smith",
                        Email = "jane.smith@example.com",
                        PhoneNumber = "0987654321",
                        Role = "admin",
                        CreatedAt = DateTime.UtcNow.AddDays(-20)
                    }
                };
                SaveUsers(defaultUsers);
                return defaultUsers;
            }

            var json = System.IO.File.ReadAllText(_dataFilePath);
            return JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
        }
    }

    private static void SaveUsers(List<User> users)
    {
        lock (_fileLock)
        {
            var json = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(_dataFilePath, json);
        }
    }

    [HttpGet]
    public ActionResult<IEnumerable<UserResponse>> GetAllUsers()
    {
        var users = _users.Select(u => new UserResponse
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email,
            PhoneNumber = u.PhoneNumber,
            Role = u.Role,
            CreatedAt = u.CreatedAt
        });

        return Ok(users);
    }

    [HttpGet("{id}")]
    public ActionResult<UserResponse> GetUser(string id)
    {
        var user = _users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return NotFound();

        return Ok(new UserResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        });
    }

    [HttpPost]
    public ActionResult<UserResponse> CreateUser(CreateUserRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Check for duplicate email
        if (_users.Any(u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase)))
        {
            return BadRequest(new { message = "A user with this email already exists" });
        }

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Role = request.Role ?? "user",
            CreatedAt = DateTime.UtcNow
        };

        try
        {
            _users.Add(user);
            SaveUsers(_users);

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new UserResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to create user", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public ActionResult<UserResponse> UpdateUser(string id, UpdateUserRequest request)
    {
        var user = _users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return NotFound();

        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;
        user.Email = request.Email ?? user.Email;
        user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
        user.Role = request.Role ?? user.Role;

        SaveUsers(_users);

        return Ok(new UserResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        });
    }

    [HttpDelete("{id}")]
    public ActionResult DeleteUser(string id)
    {
        var user = _users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return NotFound();

        _users.Remove(user);
        SaveUsers(_users);

        return NoContent();
    }
}

public class User
{
    public string Id { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class UserResponse
{
    public string Id { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateUserRequest
{
    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [StringLength(20)]
    public string? Role { get; set; }
}

public class UpdateUserRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Role { get; set; }
}
