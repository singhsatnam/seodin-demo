package net.ptidej.seodin.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.ptidej.seodin.domain.Defect;

import net.ptidej.seodin.repository.DefectRepository;
import net.ptidej.seodin.repository.search.DefectSearchRepository;
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
 * REST controller for managing Defect.
 */
@RestController
@RequestMapping("/api")
public class DefectResource {

    private final Logger log = LoggerFactory.getLogger(DefectResource.class);

    private static final String ENTITY_NAME = "defect";

    private final DefectRepository defectRepository;

    private final DefectSearchRepository defectSearchRepository;

    public DefectResource(DefectRepository defectRepository, DefectSearchRepository defectSearchRepository) {
        this.defectRepository = defectRepository;
        this.defectSearchRepository = defectSearchRepository;
    }

    /**
     * POST  /defects : Create a new defect.
     *
     * @param defect the defect to create
     * @return the ResponseEntity with status 201 (Created) and with body the new defect, or with status 400 (Bad Request) if the defect has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/defects")
    @Timed
    public ResponseEntity<Defect> createDefect(@RequestBody Defect defect) throws URISyntaxException {
        log.debug("REST request to save Defect : {}", defect);
        if (defect.getId() != null) {
            throw new BadRequestAlertException("A new defect cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Defect result = defectRepository.save(defect);
        defectSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/defects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /defects : Updates an existing defect.
     *
     * @param defect the defect to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated defect,
     * or with status 400 (Bad Request) if the defect is not valid,
     * or with status 500 (Internal Server Error) if the defect couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/defects")
    @Timed
    public ResponseEntity<Defect> updateDefect(@RequestBody Defect defect) throws URISyntaxException {
        log.debug("REST request to update Defect : {}", defect);
        if (defect.getId() == null) {
            return createDefect(defect);
        }
        Defect result = defectRepository.save(defect);
        defectSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, defect.getId().toString()))
            .body(result);
    }

    /**
     * GET  /defects : get all the defects.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of defects in body
     */
    @GetMapping("/defects")
    @Timed
    public List<Defect> getAllDefects() {
        log.debug("REST request to get all Defects");
        return defectRepository.findAll();
        }

    /**
     * GET  /defects/:id : get the "id" defect.
     *
     * @param id the id of the defect to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the defect, or with status 404 (Not Found)
     */
    @GetMapping("/defects/{id}")
    @Timed
    public ResponseEntity<Defect> getDefect(@PathVariable Long id) {
        log.debug("REST request to get Defect : {}", id);
        Defect defect = defectRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(defect));
    }

    /**
     * DELETE  /defects/:id : delete the "id" defect.
     *
     * @param id the id of the defect to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/defects/{id}")
    @Timed
    public ResponseEntity<Void> deleteDefect(@PathVariable Long id) {
        log.debug("REST request to delete Defect : {}", id);
        defectRepository.delete(id);
        defectSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/defects?query=:query : search for the defect corresponding
     * to the query.
     *
     * @param query the query of the defect search
     * @return the result of the search
     */
    @GetMapping("/_search/defects")
    @Timed
    public List<Defect> searchDefects(@RequestParam String query) {
        log.debug("REST request to search Defects for query {}", query);
        return StreamSupport
            .stream(defectSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
