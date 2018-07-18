package net.ptidej.seodin.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.ptidej.seodin.domain.Audio;

import net.ptidej.seodin.repository.AudioRepository;
import net.ptidej.seodin.repository.search.AudioSearchRepository;
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
 * REST controller for managing Audio.
 */
@RestController
@RequestMapping("/api")
public class AudioResource {

    private final Logger log = LoggerFactory.getLogger(AudioResource.class);

    private static final String ENTITY_NAME = "audio";

    private final AudioRepository audioRepository;

    private final AudioSearchRepository audioSearchRepository;

    public AudioResource(AudioRepository audioRepository, AudioSearchRepository audioSearchRepository) {
        this.audioRepository = audioRepository;
        this.audioSearchRepository = audioSearchRepository;
    }

    /**
     * POST  /audio : Create a new audio.
     *
     * @param audio the audio to create
     * @return the ResponseEntity with status 201 (Created) and with body the new audio, or with status 400 (Bad Request) if the audio has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/audio")
    @Timed
    public ResponseEntity<Audio> createAudio(@RequestBody Audio audio) throws URISyntaxException {
        log.debug("REST request to save Audio : {}", audio);
        if (audio.getId() != null) {
            throw new BadRequestAlertException("A new audio cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Audio result = audioRepository.save(audio);
        audioSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/audio/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /audio : Updates an existing audio.
     *
     * @param audio the audio to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated audio,
     * or with status 400 (Bad Request) if the audio is not valid,
     * or with status 500 (Internal Server Error) if the audio couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/audio")
    @Timed
    public ResponseEntity<Audio> updateAudio(@RequestBody Audio audio) throws URISyntaxException {
        log.debug("REST request to update Audio : {}", audio);
        if (audio.getId() == null) {
            return createAudio(audio);
        }
        Audio result = audioRepository.save(audio);
        audioSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, audio.getId().toString()))
            .body(result);
    }

    /**
     * GET  /audio : get all the audio.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of audio in body
     */
    @GetMapping("/audio")
    @Timed
    public List<Audio> getAllAudio() {
        log.debug("REST request to get all Audio");
        return audioRepository.findAll();
        }

    /**
     * GET  /audio/:id : get the "id" audio.
     *
     * @param id the id of the audio to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the audio, or with status 404 (Not Found)
     */
    @GetMapping("/audio/{id}")
    @Timed
    public ResponseEntity<Audio> getAudio(@PathVariable Long id) {
        log.debug("REST request to get Audio : {}", id);
        Audio audio = audioRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(audio));
    }

    /**
     * DELETE  /audio/:id : delete the "id" audio.
     *
     * @param id the id of the audio to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/audio/{id}")
    @Timed
    public ResponseEntity<Void> deleteAudio(@PathVariable Long id) {
        log.debug("REST request to delete Audio : {}", id);
        audioRepository.delete(id);
        audioSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/audio?query=:query : search for the audio corresponding
     * to the query.
     *
     * @param query the query of the audio search
     * @return the result of the search
     */
    @GetMapping("/_search/audio")
    @Timed
    public List<Audio> searchAudio(@RequestParam String query) {
        log.debug("REST request to search Audio for query {}", query);
        return StreamSupport
            .stream(audioSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
