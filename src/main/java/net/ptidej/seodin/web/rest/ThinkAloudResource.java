package net.ptidej.seodin.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.ptidej.seodin.domain.ThinkAloud;

import net.ptidej.seodin.repository.ThinkAloudRepository;
import net.ptidej.seodin.repository.search.ThinkAloudSearchRepository;
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
 * REST controller for managing ThinkAloud.
 */
@RestController
@RequestMapping("/api")
public class ThinkAloudResource {

    private final Logger log = LoggerFactory.getLogger(ThinkAloudResource.class);

    private static final String ENTITY_NAME = "thinkAloud";

    private final ThinkAloudRepository thinkAloudRepository;

    private final ThinkAloudSearchRepository thinkAloudSearchRepository;

    public ThinkAloudResource(ThinkAloudRepository thinkAloudRepository, ThinkAloudSearchRepository thinkAloudSearchRepository) {
        this.thinkAloudRepository = thinkAloudRepository;
        this.thinkAloudSearchRepository = thinkAloudSearchRepository;
    }

    /**
     * POST  /think-alouds : Create a new thinkAloud.
     *
     * @param thinkAloud the thinkAloud to create
     * @return the ResponseEntity with status 201 (Created) and with body the new thinkAloud, or with status 400 (Bad Request) if the thinkAloud has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/think-alouds")
    @Timed
    public ResponseEntity<ThinkAloud> createThinkAloud(@RequestBody ThinkAloud thinkAloud) throws URISyntaxException {
        log.debug("REST request to save ThinkAloud : {}", thinkAloud);
        if (thinkAloud.getId() != null) {
            throw new BadRequestAlertException("A new thinkAloud cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ThinkAloud result = thinkAloudRepository.save(thinkAloud);
        thinkAloudSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/think-alouds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /think-alouds : Updates an existing thinkAloud.
     *
     * @param thinkAloud the thinkAloud to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated thinkAloud,
     * or with status 400 (Bad Request) if the thinkAloud is not valid,
     * or with status 500 (Internal Server Error) if the thinkAloud couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/think-alouds")
    @Timed
    public ResponseEntity<ThinkAloud> updateThinkAloud(@RequestBody ThinkAloud thinkAloud) throws URISyntaxException {
        log.debug("REST request to update ThinkAloud : {}", thinkAloud);
        if (thinkAloud.getId() == null) {
            return createThinkAloud(thinkAloud);
        }
        ThinkAloud result = thinkAloudRepository.save(thinkAloud);
        thinkAloudSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, thinkAloud.getId().toString()))
            .body(result);
    }

    /**
     * GET  /think-alouds : get all the thinkAlouds.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of thinkAlouds in body
     */
    @GetMapping("/think-alouds")
    @Timed
    public List<ThinkAloud> getAllThinkAlouds() {
        log.debug("REST request to get all ThinkAlouds");
        return thinkAloudRepository.findAll();
        }

    /**
     * GET  /think-alouds/:id : get the "id" thinkAloud.
     *
     * @param id the id of the thinkAloud to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the thinkAloud, or with status 404 (Not Found)
     */
    @GetMapping("/think-alouds/{id}")
    @Timed
    public ResponseEntity<ThinkAloud> getThinkAloud(@PathVariable Long id) {
        log.debug("REST request to get ThinkAloud : {}", id);
        ThinkAloud thinkAloud = thinkAloudRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(thinkAloud));
    }

    /**
     * DELETE  /think-alouds/:id : delete the "id" thinkAloud.
     *
     * @param id the id of the thinkAloud to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/think-alouds/{id}")
    @Timed
    public ResponseEntity<Void> deleteThinkAloud(@PathVariable Long id) {
        log.debug("REST request to delete ThinkAloud : {}", id);
        thinkAloudRepository.delete(id);
        thinkAloudSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/think-alouds?query=:query : search for the thinkAloud corresponding
     * to the query.
     *
     * @param query the query of the thinkAloud search
     * @return the result of the search
     */
    @GetMapping("/_search/think-alouds")
    @Timed
    public List<ThinkAloud> searchThinkAlouds(@RequestParam String query) {
        log.debug("REST request to search ThinkAlouds for query {}", query);
        return StreamSupport
            .stream(thinkAloudSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
