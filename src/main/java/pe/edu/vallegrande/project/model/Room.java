package pe.edu.vallegrande.project.model;

import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Data
@Table(name = "room")
public class Room{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_room")
    private Long id_room;

    @Column(name = "room_number")
    private String room_number;

    @Column(name = "room_type")
    private String room_type;

    @Column(name = "activity_room")
    private  String activity_room;

    @Column(name = "room_description")
    private String room_description;

    @Column(name = "level")
    private String level;

    @Column(name = "cost_per_day")
    private Double cost_per_day;

    @Column(name = "registrationd_date", insertable = false, updatable = false)
    private LocalDateTime registrationd_date;

    @Column(name = "modification_date")
    private LocalDateTime modification_date;

    @Column(name = "state")
    private String state = "A";


}


