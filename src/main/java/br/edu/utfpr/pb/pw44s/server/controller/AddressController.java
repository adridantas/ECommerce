package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("addresses")
public class AddressController {


    private final IAddressService addressService;
    private final ModelMapper modelMapper;

    public AddressController(IAddressService addressService, ModelMapper modelMapper) {
        this.addressService = addressService;
        this.modelMapper = modelMapper;
    }

    @PostMapping
    public ResponseEntity<AddressDTO> create(@RequestBody @Valid AddressDTO addressDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            Address savedAddress = addressService.create(addressDTO, authentication);
            return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(savedAddress, AddressDTO.class));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressDTO>> listUserAddresses(@PathVariable Long userId) {
        List<Address> addresses = addressService.findByUserId(userId);
        List<AddressDTO> addressDTOs = addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(addressDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressDTO> findById(@PathVariable Long id) {
        Address address = addressService.findOne(id);
        if (address != null) {
            return ResponseEntity.ok(modelMapper.map(address, AddressDTO.class));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDTO> update(@PathVariable Long id, @RequestBody @Valid AddressDTO addressDTO) {
        Address existingAddress = addressService.findOne(id);
        if (existingAddress == null) {
            return ResponseEntity.notFound().build();
        }
        addressDTO.setId(id);
        Address updatedAddress = addressService.save(modelMapper.map(addressDTO, Address.class));
        return ResponseEntity.ok(modelMapper.map(updatedAddress, AddressDTO.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (addressService.exists(id)) {
            addressService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}