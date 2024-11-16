using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ClancyMeetingAttendance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MeetingsController : ControllerBase
{
    private static readonly List<Meeting> _meetings = new()
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
        return CreatedAtAction(nameof(GetMeeting), new { id = meeting.Id }, meeting);
    }

    [HttpGet("{id}/attendance")]
    public ActionResult<IEnumerable<Attendee>> GetAttendees(string id)
    {
        var meeting = _meetings.FirstOrDefault(m => m.Id == id);
        if (meeting == null)
            return NotFound();

        // For now, return empty list
        return Ok(new List<Attendee>());
    }

    [HttpPost("{id}/sign-in")]
    public ActionResult SignIn(string id, SignInRequest request)
    {
        var meeting = _meetings.FirstOrDefault(m => m.Id == id);
        if (meeting == null)
            return NotFound();

        meeting.Attendees++;
        return Ok();
    }

    [HttpPatch("{id}/status")]
    public ActionResult UpdateStatus(string id, UpdateStatusRequest request)
    {
        var meeting = _meetings.FirstOrDefault(m => m.Id == id);
        if (meeting == null)
            return NotFound();

        meeting.Status = request.Status;
        return Ok();
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
    public string PhoneNumber { get; set; } = string.Empty;
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class Attendee
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SignInTime { get; set; } = string.Empty;
}
