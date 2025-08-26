package com.example.chatie.Chatie.repository;

import com.example.chatie.Chatie.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByUsernameIgnoreCase(String username);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByUsernameIgnoreCase(String username);

    @Query("""
      select u from User u
      where
        (lower(u.username) like lower(concat('%', :q, '%'))
        or lower(u.email) like lower(concat('%', :q, '%'))
        or lower(u.firstName) like lower(concat('%', :q, '%'))
        or lower(u.lastName) like lower(concat('%', :q, '%')))
      order by u.username asc
    """)
    List<User> search(@Param("q") String q, Pageable pageable);
}
