package net.ptidej.seodin.web.rest;

import net.ptidej.seodin.SeodinApp;

import net.ptidej.seodin.domain.InteractiveLog;
import net.ptidej.seodin.repository.InteractiveLogRepository;
import net.ptidej.seodin.repository.search.InteractiveLogSearchRepository;
import net.ptidej.seodin.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static net.ptidej.seodin.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import net.ptidej.seodin.domain.enumeration.LogKind;
import net.ptidej.seodin.domain.enumeration.ArtifactStatus;
/**
 * Test class for the InteractiveLogResource REST controller.
 *
 * @see InteractiveLogResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SeodinApp.class)
public class InteractiveLogResourceIntTest {

    private static final LogKind DEFAULT_KIND = LogKind.SELECTION;
    private static final LogKind UPDATED_KIND = LogKind.COMMAND;

    private static final String DEFAULT_SOURCE_HANDLE = "AAAAAAAAAA";
    private static final String UPDATED_SOURCE_HANDLE = "BBBBBBBBBB";

    private static final String DEFAULT_ORIGIN = "AAAAAAAAAA";
    private static final String UPDATED_ORIGIN = "BBBBBBBBBB";

    private static final String DEFAULT_DELTA = "AAAAAAAAAA";
    private static final String UPDATED_DELTA = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_RECORDED = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_RECORDED = LocalDate.now(ZoneId.systemDefault());

    private static final ArtifactStatus DEFAULT_STATUS = ArtifactStatus.PRIVATE;
    private static final ArtifactStatus UPDATED_STATUS = ArtifactStatus.SUBMITED;

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_LICENSE = "AAAAAAAAAA";
    private static final String UPDATED_LICENSE = "BBBBBBBBBB";

    @Autowired
    private InteractiveLogRepository interactiveLogRepository;

    @Autowired
    private InteractiveLogSearchRepository interactiveLogSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restInteractiveLogMockMvc;

    private InteractiveLog interactiveLog;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final InteractiveLogResource interactiveLogResource = new InteractiveLogResource(interactiveLogRepository, interactiveLogSearchRepository);
        this.restInteractiveLogMockMvc = MockMvcBuilders.standaloneSetup(interactiveLogResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InteractiveLog createEntity(EntityManager em) {
        InteractiveLog interactiveLog = new InteractiveLog()
            .kind(DEFAULT_KIND)
            .sourceHandle(DEFAULT_SOURCE_HANDLE)
            .origin(DEFAULT_ORIGIN)
            .delta(DEFAULT_DELTA)
            .recorded(DEFAULT_RECORDED)
            .status(DEFAULT_STATUS)
            .author(DEFAULT_AUTHOR)
            .license(DEFAULT_LICENSE);
        return interactiveLog;
    }

    @Before
    public void initTest() {
        interactiveLogSearchRepository.deleteAll();
        interactiveLog = createEntity(em);
    }

    @Test
    @Transactional
    public void createInteractiveLog() throws Exception {
        int databaseSizeBeforeCreate = interactiveLogRepository.findAll().size();

        // Create the InteractiveLog
        restInteractiveLogMockMvc.perform(post("/api/interactive-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(interactiveLog)))
            .andExpect(status().isCreated());

        // Validate the InteractiveLog in the database
        List<InteractiveLog> interactiveLogList = interactiveLogRepository.findAll();
        assertThat(interactiveLogList).hasSize(databaseSizeBeforeCreate + 1);
        InteractiveLog testInteractiveLog = interactiveLogList.get(interactiveLogList.size() - 1);
        assertThat(testInteractiveLog.getKind()).isEqualTo(DEFAULT_KIND);
        assertThat(testInteractiveLog.getSourceHandle()).isEqualTo(DEFAULT_SOURCE_HANDLE);
        assertThat(testInteractiveLog.getOrigin()).isEqualTo(DEFAULT_ORIGIN);
        assertThat(testInteractiveLog.getDelta()).isEqualTo(DEFAULT_DELTA);
        assertThat(testInteractiveLog.getRecorded()).isEqualTo(DEFAULT_RECORDED);
        assertThat(testInteractiveLog.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testInteractiveLog.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testInteractiveLog.getLicense()).isEqualTo(DEFAULT_LICENSE);

        // Validate the InteractiveLog in Elasticsearch
        InteractiveLog interactiveLogEs = interactiveLogSearchRepository.findOne(testInteractiveLog.getId());
        assertThat(interactiveLogEs).isEqualToIgnoringGivenFields(testInteractiveLog);
    }

    @Test
    @Transactional
    public void createInteractiveLogWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = interactiveLogRepository.findAll().size();

        // Create the InteractiveLog with an existing ID
        interactiveLog.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restInteractiveLogMockMvc.perform(post("/api/interactive-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(interactiveLog)))
            .andExpect(status().isBadRequest());

        // Validate the InteractiveLog in the database
        List<InteractiveLog> interactiveLogList = interactiveLogRepository.findAll();
        assertThat(interactiveLogList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllInteractiveLogs() throws Exception {
        // Initialize the database
        interactiveLogRepository.saveAndFlush(interactiveLog);

        // Get all the interactiveLogList
        restInteractiveLogMockMvc.perform(get("/api/interactive-logs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(interactiveLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].kind").value(hasItem(DEFAULT_KIND.toString())))
            .andExpect(jsonPath("$.[*].sourceHandle").value(hasItem(DEFAULT_SOURCE_HANDLE.toString())))
            .andExpect(jsonPath("$.[*].origin").value(hasItem(DEFAULT_ORIGIN.toString())))
            .andExpect(jsonPath("$.[*].delta").value(hasItem(DEFAULT_DELTA.toString())))
            .andExpect(jsonPath("$.[*].recorded").value(hasItem(DEFAULT_RECORDED.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void getInteractiveLog() throws Exception {
        // Initialize the database
        interactiveLogRepository.saveAndFlush(interactiveLog);

        // Get the interactiveLog
        restInteractiveLogMockMvc.perform(get("/api/interactive-logs/{id}", interactiveLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(interactiveLog.getId().intValue()))
            .andExpect(jsonPath("$.kind").value(DEFAULT_KIND.toString()))
            .andExpect(jsonPath("$.sourceHandle").value(DEFAULT_SOURCE_HANDLE.toString()))
            .andExpect(jsonPath("$.origin").value(DEFAULT_ORIGIN.toString()))
            .andExpect(jsonPath("$.delta").value(DEFAULT_DELTA.toString()))
            .andExpect(jsonPath("$.recorded").value(DEFAULT_RECORDED.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR.toString()))
            .andExpect(jsonPath("$.license").value(DEFAULT_LICENSE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingInteractiveLog() throws Exception {
        // Get the interactiveLog
        restInteractiveLogMockMvc.perform(get("/api/interactive-logs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateInteractiveLog() throws Exception {
        // Initialize the database
        interactiveLogRepository.saveAndFlush(interactiveLog);
        interactiveLogSearchRepository.save(interactiveLog);
        int databaseSizeBeforeUpdate = interactiveLogRepository.findAll().size();

        // Update the interactiveLog
        InteractiveLog updatedInteractiveLog = interactiveLogRepository.findOne(interactiveLog.getId());
        // Disconnect from session so that the updates on updatedInteractiveLog are not directly saved in db
        em.detach(updatedInteractiveLog);
        updatedInteractiveLog
            .kind(UPDATED_KIND)
            .sourceHandle(UPDATED_SOURCE_HANDLE)
            .origin(UPDATED_ORIGIN)
            .delta(UPDATED_DELTA)
            .recorded(UPDATED_RECORDED)
            .status(UPDATED_STATUS)
            .author(UPDATED_AUTHOR)
            .license(UPDATED_LICENSE);

        restInteractiveLogMockMvc.perform(put("/api/interactive-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedInteractiveLog)))
            .andExpect(status().isOk());

        // Validate the InteractiveLog in the database
        List<InteractiveLog> interactiveLogList = interactiveLogRepository.findAll();
        assertThat(interactiveLogList).hasSize(databaseSizeBeforeUpdate);
        InteractiveLog testInteractiveLog = interactiveLogList.get(interactiveLogList.size() - 1);
        assertThat(testInteractiveLog.getKind()).isEqualTo(UPDATED_KIND);
        assertThat(testInteractiveLog.getSourceHandle()).isEqualTo(UPDATED_SOURCE_HANDLE);
        assertThat(testInteractiveLog.getOrigin()).isEqualTo(UPDATED_ORIGIN);
        assertThat(testInteractiveLog.getDelta()).isEqualTo(UPDATED_DELTA);
        assertThat(testInteractiveLog.getRecorded()).isEqualTo(UPDATED_RECORDED);
        assertThat(testInteractiveLog.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testInteractiveLog.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testInteractiveLog.getLicense()).isEqualTo(UPDATED_LICENSE);

        // Validate the InteractiveLog in Elasticsearch
        InteractiveLog interactiveLogEs = interactiveLogSearchRepository.findOne(testInteractiveLog.getId());
        assertThat(interactiveLogEs).isEqualToIgnoringGivenFields(testInteractiveLog);
    }

    @Test
    @Transactional
    public void updateNonExistingInteractiveLog() throws Exception {
        int databaseSizeBeforeUpdate = interactiveLogRepository.findAll().size();

        // Create the InteractiveLog

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restInteractiveLogMockMvc.perform(put("/api/interactive-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(interactiveLog)))
            .andExpect(status().isCreated());

        // Validate the InteractiveLog in the database
        List<InteractiveLog> interactiveLogList = interactiveLogRepository.findAll();
        assertThat(interactiveLogList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteInteractiveLog() throws Exception {
        // Initialize the database
        interactiveLogRepository.saveAndFlush(interactiveLog);
        interactiveLogSearchRepository.save(interactiveLog);
        int databaseSizeBeforeDelete = interactiveLogRepository.findAll().size();

        // Get the interactiveLog
        restInteractiveLogMockMvc.perform(delete("/api/interactive-logs/{id}", interactiveLog.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean interactiveLogExistsInEs = interactiveLogSearchRepository.exists(interactiveLog.getId());
        assertThat(interactiveLogExistsInEs).isFalse();

        // Validate the database is empty
        List<InteractiveLog> interactiveLogList = interactiveLogRepository.findAll();
        assertThat(interactiveLogList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchInteractiveLog() throws Exception {
        // Initialize the database
        interactiveLogRepository.saveAndFlush(interactiveLog);
        interactiveLogSearchRepository.save(interactiveLog);

        // Search the interactiveLog
        restInteractiveLogMockMvc.perform(get("/api/_search/interactive-logs?query=id:" + interactiveLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(interactiveLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].kind").value(hasItem(DEFAULT_KIND.toString())))
            .andExpect(jsonPath("$.[*].sourceHandle").value(hasItem(DEFAULT_SOURCE_HANDLE.toString())))
            .andExpect(jsonPath("$.[*].origin").value(hasItem(DEFAULT_ORIGIN.toString())))
            .andExpect(jsonPath("$.[*].delta").value(hasItem(DEFAULT_DELTA.toString())))
            .andExpect(jsonPath("$.[*].recorded").value(hasItem(DEFAULT_RECORDED.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InteractiveLog.class);
        InteractiveLog interactiveLog1 = new InteractiveLog();
        interactiveLog1.setId(1L);
        InteractiveLog interactiveLog2 = new InteractiveLog();
        interactiveLog2.setId(interactiveLog1.getId());
        assertThat(interactiveLog1).isEqualTo(interactiveLog2);
        interactiveLog2.setId(2L);
        assertThat(interactiveLog1).isNotEqualTo(interactiveLog2);
        interactiveLog1.setId(null);
        assertThat(interactiveLog1).isNotEqualTo(interactiveLog2);
    }
}
