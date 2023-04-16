package fpt.edu.vn.Cinema.Service;

import fpt.edu.vn.Cinema.models.User;
import fpt.edu.vn.Cinema.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;

    public User save(User entity) {
        return userRepository.save(entity);
    }

    public List<User> saveAll(List<User> entities) {
        return (List<User>)userRepository.saveAll(entities);
    }

    public Optional<User> findbyId(Integer id) {
        return userRepository.findById(id);
    }

    public boolean exitsById(Integer id) {
        return userRepository.existsById(id);
    }

    public List<User> findAll() {
        return (List<User>)userRepository.findAll();
    }

    public List<User> findAllById(List<Integer> ids) {
        return (List<User>)userRepository.findAllById(ids);
    }
}
