package net.ptidej.seodin.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.ptidej.seodin.domain.SourceCode;

import net.ptidej.seodin.repository.SourceCodeRepository;
import net.ptidej.seodin.repository.search.SourceCodeSearchRepository;
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
 * REST controller for managing SourceCode.
 */
@RestController
@RequestMapping("/api")
public class SourceCodeResource {

    private final Logger log = LoggerFactory.getLogger(SourceCodeResource.class);

    private static final String ENTITY_NAME = "sourceCode";

    private final SourceCodeRepository sourceCodeRepository;

    private final SourceCodeSearchRepository sourceCodeSearchRepository;

    public SourceCodeResource(SourceCodeRepository sourceCodeRepository, SourceCodeSearchRepository sourceCodeSearchRepository) {
        this.sourceCodeRepository = sourceCodeRepository;
        this.sourceCodeSearchRepository = sourceCodeSearchRepository;
    }

    /**
     * POST  /source-codes : Create a new sourceCode.
     *
     * @param sourceCode the sourceCode to create
     * @return the ResponseEntity with status 201 (Created) and with body the new sourceCode, or with status 400 (Bad Request) if the sourceCode has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/source-codes")
    @Timed
    public ResponseEntity<SourceCode> createSourceCode(@RequestBody SourceCode sourceCode) throws URISyntaxException {
        log.debug("REST request to save SourceCode : {}", sourceCode);
        if (sourceCode.getId() != null) {
            throw new BadRequestAlertException("A new sourceCode cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SourceCode result = sourceCodeRepository.save(sourceCode);
        sourceCodeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/source-codes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /source-codes : Updates an existing sourceCode.
     *
     * @param sourceCode the sourceCode to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated sourceCode,
     * or with status 400 (Bad Request) if the sourceCode is not valid,
     * or with status 500 (Internal Server Error) if the sourceCode couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/source-codes")
    @Timed
    public ResponseEntity<SourceCode> updateSourceCode(@RequestBody SourceCode sourceCode) throws URISyntaxException {
        log.debug("REST request to update SourceCode : {}", sourceCode);
        if (sourceCode.getId() == null) {
            return createSourceCode(sourceCode);
        }
        SourceCode result = sourceCodeRepository.save(sourceCode);
        sourceCodeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sourceCode.getId().toString()))
            .body(result);
    }

    /**
     * GET  /source-codes : get all the sourceCodes.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of sourceCodes in body
     */
    @GetMapping("/source-codes")
    @Timed
    public List<SourceCode> getAllSourceCodes() {
        log.debug("REST request to get all SourceCodes");
        return sourceCodeRepository.findAll();
        }

    /**
     * GET  /source-codes/:id : get the "id" sourceCode.
     *
     * @param id the id of the sourceCode to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the sourceCode, or with status 404 (Not Found)
     */
    @GetMapping("/source-codes/{id}")
    @Timed
    public ResponseEntity<SourceCode> getSourceCode(@PathVariable Long id) {
        log.debug("REST request to get SourceCode : {}", id);
        SourceCode sourceCode = sourceCodeRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(sourceCode));
    }

    /**
     * DELETE  /source-codes/:id : delete the "id" sourceCode.
     *
     * @param id the id of the sourceCode to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/source-codes/{id}")
    @Timed
    public ResponseEntity<Void> deleteSourceCode(@PathVariable Long id) {
        log.debug("REST request to delete SourceCode : {}", id);
        sourceCodeRepository.delete(id);
        sourceCodeSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/source-codes?query=:query : search for the sourceCode corresponding
     * to the query.
     *
     * @param query the query of the sourceCode search
     * @return the result of the search
     */
    @GetMapping("/_search/source-codes")
    @Timed
    public List<SourceCode> searchSourceCodes(@RequestParam String query) {
        log.debug("REST request to search SourceCodes for query {}", query);
        return StreamSupport
            .stream(sourceCodeSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
