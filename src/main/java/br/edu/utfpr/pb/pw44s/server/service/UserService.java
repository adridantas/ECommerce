package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = new BCryptPasswordEncoder();
    }

    public User save(User user) {
        Optional<User> existingUserByUsername = Optional.ofNullable(userRepository.findByUsername(user.getUsername()));
        if (existingUserByUsername.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "O username '" + user.getUsername() + "' já está em uso.");
        }

        Optional<User> existingUserByEmail = Optional.ofNullable(userRepository.findByEmail(user    .getEmail()));
        if (existingUserByEmail.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "O email já está em uso.");
        }

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
}