package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface IAddressService extends ICrudService<Address, Long> {
    List<Address> findByUserId(Long userId);
    Address create(AddressDTO addressDTO, Authentication authentication);

}