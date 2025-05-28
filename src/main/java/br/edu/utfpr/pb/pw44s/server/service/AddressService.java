package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.service.impl.CrudServiceImpl;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AddressService extends CrudServiceImpl<Address, Long> implements IAddressService {

    private final AddressRepository addressRepository;
    private final ModelMapper modelMapper;
    private final AuthService authService;

    public AddressService(AddressRepository addressRepository, ModelMapper modelMapper, @Lazy AuthService authService) {
        this.addressRepository = addressRepository;
        this.modelMapper = modelMapper;
        this.authService = authService;
    }

    @Override
    protected JpaRepository<Address, Long> getRepository() {
        return this.addressRepository;
    }

    @Override
    public List<Address> findByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Override
    public Address save(Address address) {
        return addressRepository.save(address);
    }

    @Override
    public Address create(AddressDTO addressDTO, Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            User user = (User) authService.loadUserByUsername(username);
            Address address = modelMapper.map(addressDTO, Address.class);
            address.setUserId(user.getId());
            return addressRepository.save(address);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado.");
        }
    }
}