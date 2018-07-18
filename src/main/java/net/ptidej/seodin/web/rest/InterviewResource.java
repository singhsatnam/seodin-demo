package net.ptidej.seodin.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.ptidej.seodin.domain.Interview;

import net.ptidej.seodin.repository.InterviewRepository;
import net.ptidej.seodin.repository.search.InterviewSearchRepository;
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
 * REST controller for managing Interview.
 */
@RestController
@RequestMapping("/api")
public class InterviewResource {

    private final Logger log = LoggerFactory.getLogger(InterviewResource.class);

    private static final String ENTITY_NAME = "interview";

    private final InterviewRepository interviewRepository;

    private final InterviewSearchRepository interviewSearchRepository;

    public InterviewResource(InterviewRepository interviewRepository, InterviewSearchRepository interviewSearchRepository) {
        this.interviewRepository = interviewRepository;
        this.interviewSearchRepository = interviewSearchRepository;
    }

    /**
     * POST  /interviews : Create a new interview.
     *
     * @param interview the interview to create
     * @return the ResponseEntity with status 201 (Created) and with body the new interview, or with status 400 (Bad Request) if the interview has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/interviews")
    @Timed
    public ResponseEntity<Interview> createInterview(@RequestBody Interview interview) throws URISyntaxException {
        log.debug("REST request to save Interview : {}", interview);
        if (interview.getId() != null) {
            throw new BadRequestAlertException("A new interview cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Interview result = interviewRepository.save(interview);
        interviewSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/interviews/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /interviews : Updates an existing interview.
     *
     * @param interview the interview to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated interview,
     * or with status 400 (Bad Request) if the interview is not valid,
     * or with status 500 (Internal Server Error) if the interview couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/interviews")
    @Timed
    public ResponseEntity<Interview> updateInterview(@RequestBody Interview interview) throws URISyntaxException {
        log.debug("REST request to update Interview : {}", interview);
        if (interview.getId() == null) {
            return createInterview(interview);
        }
        Interview result = interviewRepository.save(interview);
        interviewSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, interview.getId().toString()))
            .body(result);
    }

    /**
     * GET  /interviews : get all the interviews.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of interviews in body
     */
    @GetMapping("/interviews")
    @Timed
    public List<Interview> getAllInterviews() {
        log.debug("REST request to get all Interviews");
        return interviewRepository.findAll();
        }

    /**
     * GET  /interviews/:id : get the "id" interview.
     *
     * @param id the id of the interview to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the interview, or with status 404 (Not Found)
     */
    @GetMapping("/interviews/{id}")
    @Timed
    public ResponseEntity<Interview> getInterview(@PathVariable Long id) {
        log.debug("REST request to get Interview : {}", id);
        Interview interview = interviewRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(interview));
    }

    /**
     * DELETE  /interviews/:id : delete the "id" interview.
     *
     * @param id the id of the interview to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/interviews/{id}")
    @Timed
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        log.debug("REST request to delete Interview : {}", id);
        interviewRepository.delete(id);
        interviewSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/interviews?query=:query : search for the interview corresponding
     * to the query.
     *
     * @param query the query of the interview search
     * @return the result of the search
     */
    @GetMapping("/_search/interviews")
    @Timed
    public List<Interview> searchInterviews(@RequestParam String query) {
        log.debug("REST request to search Interviews for query {}", query);
        return StreamSupport
            .stream(interviewSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
