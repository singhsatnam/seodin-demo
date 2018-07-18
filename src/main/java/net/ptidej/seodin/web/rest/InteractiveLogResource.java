package net.ptidej.seodin.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.ptidej.seodin.domain.InteractiveLog;

import net.ptidej.seodin.repository.InteractiveLogRepository;
import net.ptidej.seodin.repository.search.InteractiveLogSearchRepository;
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
 * REST controller for managing InteractiveLog.
 */
@RestController
@RequestMapping("/api")
public class InteractiveLogResource {

    private final Logger log = LoggerFactory.getLogger(InteractiveLogResource.class);

    private static final String ENTITY_NAME = "interactiveLog";

    private final InteractiveLogRepository interactiveLogRepository;

    private final InteractiveLogSearchRepository interactiveLogSearchRepository;

    public InteractiveLogResource(InteractiveLogRepository interactiveLogRepository, InteractiveLogSearchRepository interactiveLogSearchRepository) {
        this.interactiveLogRepository = interactiveLogRepository;
        this.interactiveLogSearchRepository = interactiveLogSearchRepository;
    }

    /**
     * POST  /interactive-logs : Create a new interactiveLog.
     *
     * @param interactiveLog the interactiveLog to create
     * @return the ResponseEntity with status 201 (Created) and with body the new interactiveLog, or with status 400 (Bad Request) if the interactiveLog has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/interactive-logs")
    @Timed
    public ResponseEntity<InteractiveLog> createInteractiveLog(@RequestBody InteractiveLog interactiveLog) throws URISyntaxException {
        log.debug("REST request to save InteractiveLog : {}", interactiveLog);
        if (interactiveLog.getId() != null) {
            throw new BadRequestAlertException("A new interactiveLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        InteractiveLog result = interactiveLogRepository.save(interactiveLog);
        interactiveLogSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/interactive-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /interactive-logs : Updates an existing interactiveLog.
     *
     * @param interactiveLog the interactiveLog to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated interactiveLog,
     * or with status 400 (Bad Request) if the interactiveLog is not valid,
     * or with status 500 (Internal Server Error) if the interactiveLog couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/interactive-logs")
    @Timed
    public ResponseEntity<InteractiveLog> updateInteractiveLog(@RequestBody InteractiveLog interactiveLog) throws URISyntaxException {
        log.debug("REST request to update InteractiveLog : {}", interactiveLog);
        if (interactiveLog.getId() == null) {
            return createInteractiveLog(interactiveLog);
        }
        InteractiveLog result = interactiveLogRepository.save(interactiveLog);
        interactiveLogSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, interactiveLog.getId().toString()))
            .body(result);
    }

    /**
     * GET  /interactive-logs : get all the interactiveLogs.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of interactiveLogs in body
     */
    @GetMapping("/interactive-logs")
    @Timed
    public List<InteractiveLog> getAllInteractiveLogs() {
        log.debug("REST request to get all InteractiveLogs");
        return interactiveLogRepository.findAll();
        }

    /**
     * GET  /interactive-logs/:id : get the "id" interactiveLog.
     *
     * @param id the id of the interactiveLog to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the interactiveLog, or with status 404 (Not Found)
     */
    @GetMapping("/interactive-logs/{id}")
    @Timed
    public ResponseEntity<InteractiveLog> getInteractiveLog(@PathVariable Long id) {
        log.debug("REST request to get InteractiveLog : {}", id);
        InteractiveLog interactiveLog = interactiveLogRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(interactiveLog));
    }

    /**
     * DELETE  /interactive-logs/:id : delete the "id" interactiveLog.
     *
     * @param id the id of the interactiveLog to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/interactive-logs/{id}")
    @Timed
    public ResponseEntity<Void> deleteInteractiveLog(@PathVariable Long id) {
        log.debug("REST request to delete InteractiveLog : {}", id);
        interactiveLogRepository.delete(id);
        interactiveLogSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/interactive-logs?query=:query : search for the interactiveLog corresponding
     * to the query.
     *
     * @param query the query of the interactiveLog search
     * @return the result of the search
     */
    @GetMapping("/_search/interactive-logs")
    @Timed
    public List<InteractiveLog> searchInteractiveLogs(@RequestParam String query) {
        log.debug("REST request to search InteractiveLogs for query {}", query);
        return StreamSupport
            .stream(interactiveLogSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
