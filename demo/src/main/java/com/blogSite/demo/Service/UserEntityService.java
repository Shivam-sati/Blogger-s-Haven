package com.blogSite.demo.Service;

import com.blogSite.demo.Entity.User;
import com.blogSite.demo.Repository.UserRepo;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class UserEntityService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void saveAdmin(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Arrays.asList("ADMIN")); // Add "ROLE_" prefix
        userRepo.save(user);
    }

    public void saveNewUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Arrays.asList("USER")); // Add "ROLE_" prefix
        userRepo.save(user);
    }

    public List<User>getAll(){
        return  userRepo.findAll();
    }

    public Optional<User>getUser(ObjectId id){
        return  userRepo.findById(id);
    }


    public User findByUsername(String userName) {
        return userRepo.findByUserName(userName);
    }

    public Optional<User> findByUserId(ObjectId id){
        return userRepo.findById(id);
    }

    public void saveEntry(User user) {
        userRepo.save(user);
    }

    public void deleteUser(ObjectId id){
        if (!userRepo.existsById(id)) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        userRepo.deleteById(id);
    }
}
