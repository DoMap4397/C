package fpt.edu.vn.Cinema.repository;
import fpt.edu.vn.Cinema.models.User;
import org.springframework.data.repository.CrudRepository;
public interface UserRepository extends CrudRepository<User, Integer> {
}
