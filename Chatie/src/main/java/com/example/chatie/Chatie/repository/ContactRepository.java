package com.example.chatie.Chatie.repository;

import com.example.chatie.Chatie.entity.Contact;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByOwnerIdOrderByFirstNameAsc(Long ownerId);

    Optional<Contact> findByIdAndOwnerId(Long id, Long ownerId);

    boolean existsByOwnerIdAndEmailIgnoreCase(Long ownerId, String email);

    @Query("""
        select c from Contact c
        where c.owner.id = :ownerId and (
            lower(c.firstName) like lower(concat('%', :q, '%')) or
            lower(c.lastName) like lower(concat('%', :q, '%')) or
            lower(c.email) like lower(concat('%', :q, '%'))
        )
        order by c.firstName asc
    """)
    List<Contact> search(@Param("ownerId") Long ownerId, @Param("q") String q);
}
