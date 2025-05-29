package com.example.chatie.Chatie.exception.user;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }

}
