package fpt.edu.vn.Cinema.models;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
@Data
@Table(name = "user")
@Entity
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(length = 2000)
    private String name;
    private Integer age;
    private String mail;
    private String address;
    private String phone;
}
