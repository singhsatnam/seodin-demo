package net.ptidej.seodin.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.ptidej.seodin.domain.DesignPattern;

import net.ptidej.seodin.repository.DesignPatternRepository;
import net.ptidej.seodin.repository.search.DesignPatternSearchRepository;
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
 * REST controller for managing DesignPattern.
 */
@RestController
@RequestMapping("/api")
public class DesignPatternResource {

    private final Logger log = LoggerFactory.getLogger(DesignPatternResource.class);

    private static final String ENTITY_NAME = "designPattern";

    private final DesignPatternRepository designPatternRepository;

    private final DesignPatternSearchRepository designPatternSearchRepository;

    public DesignPatternResource(DesignPatternRepository designPatternRepository, DesignPatternSearchRepository designPatternSearchRepository) {
        this.designPatternRepository = designPatternRepository;
        this.designPatternSearchRepository = designPatternSearchRepository;
    }

    /**
     * POST  /design-patterns : Create a new designPattern.
     *
     * @param designPattern the designPattern to create
     * @return the ResponseEntity with status 201 (Created) and with body the new designPattern, or with status 400 (Bad Request) if the designPattern has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/design-patterns")
    @Timed
    public ResponseEntity<DesignPattern> createDesignPattern(@RequestBody DesignPattern designPattern) throws URISyntaxException {
        log.debug("REST request to save DesignPattern : {}", designPattern);
        if (designPattern.getId() != null) {
            throw new BadRequestAlertException("A new designPattern cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DesignPattern result = designPatternRepository.save(designPattern);
        designPatternSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/design-patterns/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /design-patterns : Updates an existing designPattern.
     *
     * @param designPattern the designPattern to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated designPattern,
     * or with status 400 (Bad Request) if the designPattern is not valid,
     * or with status 500 (Internal Server Error) if the designPattern couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/design-patterns")
    @Timed
    public ResponseEntity<DesignPattern> updateDesignPattern(@RequestBody DesignPattern designPattern) throws URISyntaxException {
        log.debug("REST request to update DesignPattern : {}", designPattern);
        if (designPattern.getId() == null) {
            return createDesignPattern(designPattern);
        }
        DesignPattern result = designPatternRepository.save(designPattern);
        designPatternSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, designPattern.getId().toString()))
            .body(result);
    }

    /**
     * GET  /design-patterns : get all the designPatterns.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of designPatterns in body
     */
    @GetMapping("/design-patterns")
    @Timed
    public List<DesignPattern> getAllDesignPatterns() {
        log.debug("REST request to get all DesignPatterns");
        return designPatternRepository.findAll();
        }

    /**
     * GET  /design-patterns/:id : get the "id" designPattern.
     *
     * @param id the id of the designPattern to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the designPattern, or with status 404 (Not Found)
     */
    @GetMapping("/design-patterns/{id}")
    @Timed
    public ResponseEntity<DesignPattern> getDesignPattern(@PathVariable Long id) {
        log.debug("REST request to get DesignPattern : {}", id);
        DesignPattern designPattern = designPatternRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(designPattern));
    }

    /**
     * DELETE  /design-patterns/:id : delete the "id" designPattern.
     *
     * @param id the id of the designPattern to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/design-patterns/{id}")
    @Timed
    public ResponseEntity<Void> deleteDesignPattern(@PathVariable Long id) {
        log.debug("REST request to delete DesignPattern : {}", id);
        designPatternRepository.delete(id);
        designPatternSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/design-patterns?query=:query : search for the designPattern corresponding
     * to the query.
     *
     * @param query the query of the designPattern search
     * @return the result of the search
     */
    @GetMapping("/_search/design-patterns")
    @Timed
    public List<DesignPattern> searchDesignPatterns(@RequestParam String query) {
        log.debug("REST request to search DesignPatterns for query {}", query);
        return StreamSupport
            .stream(designPatternSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
