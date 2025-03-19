package com.blogSite.demo.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
public class ProfileUpdateRequest {
    
    private String userName;
    private String email;
    private String bio;
}
