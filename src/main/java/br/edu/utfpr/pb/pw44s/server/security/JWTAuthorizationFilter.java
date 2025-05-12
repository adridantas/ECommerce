package br.edu.utfpr.pb.pw44s.server.security;

import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.io.IOException;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {
    private final AuthService authService;

    public JWTAuthorizationFilter(AuthenticationManager authenticationManager, AuthService authService) {
        super(authenticationManager);
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        String header = request.getHeader(SecurityConstants.HEADER_STRING);
        if (header == null || !header.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            chain.doFilter(request, response);
            return;
        }
        UsernamePasswordAuthenticationToken authenticationToken = getAuthentication(request);
        System.out.println("Authentication Token in JWTAuthorizationFilter: " + authenticationToken);
        if (authenticationToken != null) {
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            System.out.println("SecurityContextHolder Authentication: " + SecurityContextHolder.getContext().getAuthentication());
        } else {
            System.out.println("Authentication Token is null!");
        }
        chain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken
    getAuthentication(HttpServletRequest request) {
        String token = request.getHeader(SecurityConstants.HEADER_STRING);
        if (token != null) {
            try {
                String username =
                        JWT.require(Algorithm.HMAC512(SecurityConstants.SECRET))
                                .build()
                                .verify(token.replace(SecurityConstants.TOKEN_PREFIX, ""))
                                .getSubject();
                System.out.println("Username extracted from token: " + username);
                if (username != null) {
                    User user = (User) authService.loadUserByUsername(username);
                    System.out.println("User loaded from AuthService: " + user);
                    if (user != null) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()); // Mudança aqui
                        System.out.println("Created Authentication Token: " + authToken);
                        return authToken;
                    }
                }
            } catch (Exception e) {
                System.err.println("Error verifying token: " + e.getMessage());
                return null;
            }
        }
        return null;
    }
}