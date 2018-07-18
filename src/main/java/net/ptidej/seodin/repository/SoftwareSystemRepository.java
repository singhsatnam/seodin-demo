package net.ptidej.seodin.repository;

import net.ptidej.seodin.domain.SoftwareSystem;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the SoftwareSystem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SoftwareSystemRepository extends JpaRepository<SoftwareSystem, Long> {

}
