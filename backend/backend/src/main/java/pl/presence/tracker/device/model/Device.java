package pl.presence.tracker.device.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "device")
public class Device {

    @Id
    @Column(nullable = false, unique = true)
    private String id;
    
    @Column(nullable = false)
    private String name;

    public Device() {
    }

    public Device(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
}
