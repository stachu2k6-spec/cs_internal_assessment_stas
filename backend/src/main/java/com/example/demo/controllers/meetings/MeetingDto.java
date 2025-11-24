package com.example.demo.controllers.meetings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MeetingDto {
    private String id;
    private String date;
    private String time;
    private float duration;
    private String notes;
}
