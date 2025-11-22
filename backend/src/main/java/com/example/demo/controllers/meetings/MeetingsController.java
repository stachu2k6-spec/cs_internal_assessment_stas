package com.example.demo.controllers.meetings;

import com.example.demo.domains.meetings.MeetingsFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/meetings")
public class MeetingsController {

    private final MeetingsFacade meetingFacade;

    public MeetingsController(MeetingsFacade meetingFacade) {
        this.meetingFacade = meetingFacade;
    }

    @GetMapping
    public List<MeetingsDto> getMeetings() {
        return meetingFacade.getMeetings();
    }

    @PostMapping
    public MeetingsDto addMeeting(@RequestBody MeetingsDto meetingsDto) {
        return meetingFacade.addMeetings(meetingsDto);
    }

    @GetMapping("/{id}")
    public MeetingsDto getMeeting(@PathVariable String id) {
        return meetingFacade.getMeetingsById(id);
    }

    @PutMapping("/{id}")
    public MeetingsDto updateMeeting(@PathVariable String id, @RequestBody MeetingsDto meetingsDto) {
        return meetingFacade.updateMeeting(id, meetingsDto);
    }

    @DeleteMapping("/{id}")
    public String deleteMeeting(@PathVariable String id) {
        meetingFacade.deleteMeeting(id);
        return "ok";
    }
}
