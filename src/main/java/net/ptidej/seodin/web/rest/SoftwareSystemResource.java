package net.ptidej.seodin.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.ptidej.seodin.domain.SoftwareSystem;

import net.ptidej.seodin.repository.SoftwareSystemRepository;
import net.ptidej.seodin.repository.search.SoftwareSystemSearchRepository;
import net.ptidej.seodin.web.rest.errors.BadRequestAlertException;
import net.ptidej.seodin.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing SoftwareSystem.
 */
@RestController
@RequestMapping("/api")
public class SoftwareSystemResource {

    private final Logger log = LoggerFactory.getLogger(SoftwareSystemResource.class);

    private static final String ENTITY_NAME = "softwareSystem";

    private final SoftwareSystemRepository softwareSystemRepository;

    private final SoftwareSystemSearchRepository softwareSystemSearchRepository;

    public SoftwareSystemResource(SoftwareSystemRepository softwareSystemRepository, SoftwareSystemSearchRepository softwareSystemSearchRepository) {
        this.softwareSystemRepository = softwareSystemRepository;
        this.softwareSystemSearchRepository = softwareSystemSearchRepository;
    }

    /**
     * POST  /software-systems : Create a new softwareSystem.
     *
     * @param softwareSystem the softwareSystem to create
     * @return the ResponseEntity with status 201 (Created) and with body the new softwareSystem, or with status 400 (Bad Request) if the softwareSystem has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/software-systems")
    @Timed
    public ResponseEntity<SoftwareSystem> createSoftwareSystem(@RequestBody SoftwareSystem softwareSystem) throws URISyntaxException {
        log.debug("REST request to save SoftwareSystem : {}", softwareSystem);
        if (softwareSystem.getId() != null) {
            throw new BadRequestAlertException("A new softwareSystem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SoftwareSystem result = softwareSystemRepository.save(softwareSystem);
        softwareSystemSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/software-systems/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /software-systems : Updates an existing softwareSystem.
     *
     * @param softwareSystem the softwareSystem to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated softwareSystem,
     * or with status 400 (Bad Request) if the softwareSystem is not valid,
     * or with status 500 (Internal Server Error) if the softwareSystem couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/software-systems")
    @Timed
    public ResponseEntity<SoftwareSystem> updateSoftwareSystem(@RequestBody SoftwareSystem softwareSystem) throws URISyntaxException {
        log.debug("REST request to update SoftwareSystem : {}", softwareSystem);
        if (softwareSystem.getId() == null) {
            return createSoftwareSystem(softwareSystem);
        }
        SoftwareSystem result = softwareSystemRepository.save(softwareSystem);
        softwareSystemSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, softwareSystem.getId().toString()))
            .body(result);
    }

    /**
     * GET  /software-systems : get all the softwareSystems.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of softwareSystems in body
     */
    @GetMapping("/software-systems")
    @Timed
    public List<SoftwareSystem> getAllSoftwareSystems() {
        log.debug("REST request to get all SoftwareSystems");
        return softwareSystemRepository.findAll();
        }

    /**
     * GET  /software-systems/:id : get the "id" softwareSystem.
     *
     * @param id the id of the softwareSystem to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the softwareSystem, or with status 404 (Not Found)
     */
    @GetMapping("/software-systems/{id}")
    @Timed
    public ResponseEntity<SoftwareSystem> getSoftwareSystem(@PathVariable Long id) {
        log.debug("REST request to get SoftwareSystem : {}", id);
        SoftwareSystem softwareSystem = softwareSystemRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(softwareSystem));
    }

    /**
     * DELETE  /software-systems/:id : delete the "id" softwareSystem.
     *
     * @param id the id of the softwareSystem to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/software-systems/{id}")
    @Timed
    public ResponseEntity<Void> deleteSoftwareSystem(@PathVariable Long id) {
        log.debug("REST request to delete SoftwareSystem : {}", id);
        softwareSystemRepository.delete(id);
        softwareSystemSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/software-systems?query=:query : search for the softwareSystem corresponding
     * to the query.
     *
     * @param query the query of the softwareSystem search
     * @return the result of the search
     */
    @GetMapping("/_search/software-systems")
    @Timed
    public List<SoftwareSystem> searchSoftwareSystems(@RequestParam String query) {
        log.debug("REST request to search SoftwareSystems for query {}", query);
        return StreamSupport
            .stream(softwareSystemSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
