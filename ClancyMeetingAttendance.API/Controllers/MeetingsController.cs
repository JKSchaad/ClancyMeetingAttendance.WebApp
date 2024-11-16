using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text.Json;
using System.IO;

namespace ClancyMeetingAttendance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MeetingsController : ControllerBase
{
    private static readonly string _dataFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "meetings.json");
    private static readonly object _fileLock = new object();
    private static List<Meeting> _meetings = LoadMeetings();

    private static List<Meeting> LoadMeetings()
    {
        lock (_fileLock)
        {
            if (!System.IO.File.Exists(_dataFilePath))
            {
                var defaultMeetings = new List<Meeting>
                {
                    new Meeting
                    {
                        Id = "1",
                        Title = "Weekly Team Sync",
                        Date = "2024-01-22",
                        Time = "10:00",
                        Location = "Conference Room A",
                        Attendees = 0,
                        Status = "upcoming"
                    },
                    new Meeting
                    {
                        Id = "2",
                        Title = "Project Review",
                        Date = "2024-01-23",
                        Time = "14:00",
                        Location = "Conference Room B",
                        Attendees = 0,
                        Status = "upcoming"
                    },
                    new Meeting
                    {
                        Id = "3",
                        Title = "Client Presentation",
                        Date = "2024-01-24",
                        Time = "15:30",
                        Location = "Meeting Room 1",
                        Attendees = 0,
                        Status = "upcoming"
                    }
                };
                SaveMeetings(defaultMeetings);
                return defaultMeetings;
            }

            var json = System.IO.File.ReadAllText(_dataFilePath);
            return JsonSerializer.Deserialize<List<Meeting>>(json) ?? new List<Meeting>();
        }
    }

    private static void SaveMeetings(List<Meeting> meetings)
    {
        lock (_fileLock)
        {
            var json = JsonSerializer.Serialize(meetings, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(_dataFilePath, json);
        }
    }

    [HttpGet]
    public ActionResult<IEnumerable<Meeting>> GetAllMeetings()
    {
        return Ok(_meetings);
    }

    [HttpGet("{id}")]
    public ActionResult<Meeting> GetMeeting(string id)
    {
        var meeting = _meetings.FirstOrDefault(m => m.Id == id);
        if (meeting == null)
            return NotFound();

        return Ok(meeting);
    }

    [HttpPost]
    public ActionResult<Meeting> CreateMeeting(CreateMeetingRequest request)
    {
        var meeting = new Meeting
        {
            Id = Guid.NewGuid().ToString(),
            Title = request.Title,
            Date = request.Date,
            Time = request.Time,
            Location = request.Location,
            Attendees = 0,
            Status = "upcoming"
        };

        _meetings.Add(meeting);
        SaveMeetings(_meetings);
        Console.WriteLine($"Meeting created with ID: {meeting.Id}");
        Console.WriteLine($"Total meetings in memory: {_meetings.Count}");
        return CreatedAtAction(nameof(GetMeeting), new { id = meeting.Id }, meeting);
    }

    [HttpGet("{id}/attendance")]
    public ActionResult<IEnumerable<Attendee>> GetAttendees(string id)
    {
        var meeting = _meetings.FirstOrDefault(m => m.Id == id);
        if (meeting == null)
            return NotFound();

        return Ok(new List<Attendee>());
    }

    [HttpPost("{id}/sign-in")]
    public ActionResult SignIn(string id, SignInRequest request)
    {
        var meeting = _meetings.FirstOrDefault(m => m.Id == id);
        if (meeting == null)
            return NotFound();

        meeting.Attendees++;
        SaveMeetings(_meetings);
        return Ok();
    }

    [HttpPatch("{id}/status")]
    public ActionResult UpdateStatus(string id, UpdateStatusRequest request)
    {
        var meeting = _meetings.FirstOrDefault(m => m.Id == id);
        if (meeting == null)
            return NotFound();

        meeting.Status = request.Status;
        SaveMeetings(_meetings);
        return Ok();
    }

    [HttpGet("{id}/qr-code")]
    public ActionResult GetQRCode(string id)
    {
        Console.WriteLine($"Generating QR code for meeting ID: {id}");
        Console.WriteLine($"Total meetings in memory: {_meetings.Count}");
        var meeting = _meetings.FirstOrDefault(m => m.Id == id);
        if (meeting == null)
        {
            Console.WriteLine($"Meeting not found with ID: {id}");
            return NotFound();
        }

        try
        {
            // Generate QR code data
            var qrData = $"meeting:{id}";
            using var qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(qrData, QRCodeGenerator.ECCLevel.Q);
            var pngByteQRCode = new PngByteQRCode(qrCodeData);
            var qrCodeBytes = pngByteQRCode.GetGraphic(20);
            var qrCodeBase64 = Convert.ToBase64String(qrCodeBytes);

            Console.WriteLine($"Successfully generated QR code for meeting: {meeting.Title}");
            return Ok(new { qrCode = qrCodeBase64 });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating QR code: {ex.Message}");
            return StatusCode(500, new { error = "Failed to generate QR code" });
        }
    }
}

public class Meeting
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int Attendees { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class CreateMeetingRequest
{
    public string Title { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
}

public class SignInRequest
{
    public string Name { get; set; } = string.Empty;
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class Attendee
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public DateTime SignInTime { get; set; }
}
