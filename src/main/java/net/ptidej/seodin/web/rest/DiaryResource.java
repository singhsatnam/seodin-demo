package net.ptidej.seodin.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.ptidej.seodin.domain.Diary;

import net.ptidej.seodin.repository.DiaryRepository;
import net.ptidej.seodin.repository.search.DiarySearchRepository;
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
 * REST controller for managing Diary.
 */
@RestController
@RequestMapping("/api")
public class DiaryResource {

    private final Logger log = LoggerFactory.getLogger(DiaryResource.class);

    private static final String ENTITY_NAME = "diary";

    private final DiaryRepository diaryRepository;

    private final DiarySearchRepository diarySearchRepository;

    public DiaryResource(DiaryRepository diaryRepository, DiarySearchRepository diarySearchRepository) {
        this.diaryRepository = diaryRepository;
        this.diarySearchRepository = diarySearchRepository;
    }

    /**
     * POST  /diaries : Create a new diary.
     *
     * @param diary the diary to create
     * @return the ResponseEntity with status 201 (Created) and with body the new diary, or with status 400 (Bad Request) if the diary has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/diaries")
    @Timed
    public ResponseEntity<Diary> createDiary(@RequestBody Diary diary) throws URISyntaxException {
        log.debug("REST request to save Diary : {}", diary);
        if (diary.getId() != null) {
            throw new BadRequestAlertException("A new diary cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Diary result = diaryRepository.save(diary);
        diarySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/diaries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /diaries : Updates an existing diary.
     *
     * @param diary the diary to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated diary,
     * or with status 400 (Bad Request) if the diary is not valid,
     * or with status 500 (Internal Server Error) if the diary couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/diaries")
    @Timed
    public ResponseEntity<Diary> updateDiary(@RequestBody Diary diary) throws URISyntaxException {
        log.debug("REST request to update Diary : {}", diary);
        if (diary.getId() == null) {
            return createDiary(diary);
        }
        Diary result = diaryRepository.save(diary);
        diarySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, diary.getId().toString()))
            .body(result);
    }

    /**
     * GET  /diaries : get all the diaries.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of diaries in body
     */
    @GetMapping("/diaries")
    @Timed
    public List<Diary> getAllDiaries() {
        log.debug("REST request to get all Diaries");
        return diaryRepository.findAll();
        }

    /**
     * GET  /diaries/:id : get the "id" diary.
     *
     * @param id the id of the diary to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the diary, or with status 404 (Not Found)
     */
    @GetMapping("/diaries/{id}")
    @Timed
    public ResponseEntity<Diary> getDiary(@PathVariable Long id) {
        log.debug("REST request to get Diary : {}", id);
        Diary diary = diaryRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(diary));
    }

    /**
     * DELETE  /diaries/:id : delete the "id" diary.
     *
     * @param id the id of the diary to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/diaries/{id}")
    @Timed
    public ResponseEntity<Void> deleteDiary(@PathVariable Long id) {
        log.debug("REST request to delete Diary : {}", id);
        diaryRepository.delete(id);
        diarySearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/diaries?query=:query : search for the diary corresponding
     * to the query.
     *
     * @param query the query of the diary search
     * @return the result of the search
     */
    @GetMapping("/_search/diaries")
    @Timed
    public List<Diary> searchDiaries(@RequestParam String query) {
        log.debug("REST request to search Diaries for query {}", query);
        return StreamSupport
            .stream(diarySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
