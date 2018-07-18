package net.ptidej.seodin.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.ptidej.seodin.domain.TestCase;

import net.ptidej.seodin.repository.TestCaseRepository;
import net.ptidej.seodin.repository.search.TestCaseSearchRepository;
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
 * REST controller for managing TestCase.
 */
@RestController
@RequestMapping("/api")
public class TestCaseResource {

    private final Logger log = LoggerFactory.getLogger(TestCaseResource.class);

    private static final String ENTITY_NAME = "testCase";

    private final TestCaseRepository testCaseRepository;

    private final TestCaseSearchRepository testCaseSearchRepository;

    public TestCaseResource(TestCaseRepository testCaseRepository, TestCaseSearchRepository testCaseSearchRepository) {
        this.testCaseRepository = testCaseRepository;
        this.testCaseSearchRepository = testCaseSearchRepository;
    }

    /**
     * POST  /test-cases : Create a new testCase.
     *
     * @param testCase the testCase to create
     * @return the ResponseEntity with status 201 (Created) and with body the new testCase, or with status 400 (Bad Request) if the testCase has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/test-cases")
    @Timed
    public ResponseEntity<TestCase> createTestCase(@RequestBody TestCase testCase) throws URISyntaxException {
        log.debug("REST request to save TestCase : {}", testCase);
        if (testCase.getId() != null) {
            throw new BadRequestAlertException("A new testCase cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TestCase result = testCaseRepository.save(testCase);
        testCaseSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/test-cases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /test-cases : Updates an existing testCase.
     *
     * @param testCase the testCase to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated testCase,
     * or with status 400 (Bad Request) if the testCase is not valid,
     * or with status 500 (Internal Server Error) if the testCase couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/test-cases")
    @Timed
    public ResponseEntity<TestCase> updateTestCase(@RequestBody TestCase testCase) throws URISyntaxException {
        log.debug("REST request to update TestCase : {}", testCase);
        if (testCase.getId() == null) {
            return createTestCase(testCase);
        }
        TestCase result = testCaseRepository.save(testCase);
        testCaseSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, testCase.getId().toString()))
            .body(result);
    }

    /**
     * GET  /test-cases : get all the testCases.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of testCases in body
     */
    @GetMapping("/test-cases")
    @Timed
    public List<TestCase> getAllTestCases() {
        log.debug("REST request to get all TestCases");
        return testCaseRepository.findAll();
        }

    /**
     * GET  /test-cases/:id : get the "id" testCase.
     *
     * @param id the id of the testCase to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the testCase, or with status 404 (Not Found)
     */
    @GetMapping("/test-cases/{id}")
    @Timed
    public ResponseEntity<TestCase> getTestCase(@PathVariable Long id) {
        log.debug("REST request to get TestCase : {}", id);
        TestCase testCase = testCaseRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(testCase));
    }

    /**
     * DELETE  /test-cases/:id : delete the "id" testCase.
     *
     * @param id the id of the testCase to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/test-cases/{id}")
    @Timed
    public ResponseEntity<Void> deleteTestCase(@PathVariable Long id) {
        log.debug("REST request to delete TestCase : {}", id);
        testCaseRepository.delete(id);
        testCaseSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/test-cases?query=:query : search for the testCase corresponding
     * to the query.
     *
     * @param query the query of the testCase search
     * @return the result of the search
     */
    @GetMapping("/_search/test-cases")
    @Timed
    public List<TestCase> searchTestCases(@RequestParam String query) {
        log.debug("REST request to search TestCases for query {}", query);
        return StreamSupport
            .stream(testCaseSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
