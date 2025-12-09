package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.model.Role;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import lombok.Data;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

        private final UserRepository userRepository;

        public AdminUserController(UserRepository userRepository) {
            this.userRepository = userRepository;
        }

        @GetMapping
        public List<User> listAll() {
            return userRepository.findAll();
        }

        @PutMapping("/{id}/activate")
        public User activate(@PathVariable Long id) {
            User user = userRepository.findById(id).orElseThrow();
            user.setActive(true);
            return userRepository.save(user);
        }

        @PutMapping("/{id}/role")
        public User changeRole(@PathVariable Long id, @RequestBody ChangeRoleRequest req) {
            User user = userRepository.findById(id).orElseThrow();
            user.setRole(req.getRole());
            return userRepository.save(user);
        }

        @Data
        public static class ChangeRoleRequest {
            private Role role;
        }
    }
