package net.ptidej.seodin.web.rest;

import net.ptidej.seodin.SeodinApp;

import net.ptidej.seodin.domain.Defect;
import net.ptidej.seodin.repository.DefectRepository;
import net.ptidej.seodin.repository.search.DefectSearchRepository;
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
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static net.ptidej.seodin.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import net.ptidej.seodin.domain.enumeration.ArtifactStatus;
import net.ptidej.seodin.domain.enumeration.Resolution;
import net.ptidej.seodin.domain.enumeration.Severity;
import net.ptidej.seodin.domain.enumeration.Priority;
/**
 * Test class for the DefectResource REST controller.
 *
 * @see DefectResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SeodinApp.class)
public class DefectResourceIntTest {

    private static final String DEFAULT_TICKET = "AAAAAAAAAA";
    private static final String UPDATED_TICKET = "BBBBBBBBBB";

    private static final String DEFAULT_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_SUMMARY = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ArtifactStatus DEFAULT_STATUS = ArtifactStatus.PRIVATE;
    private static final ArtifactStatus UPDATED_STATUS = ArtifactStatus.SUBMITED;

    private static final Resolution DEFAULT_RESOLUTION = Resolution.NONE;
    private static final Resolution UPDATED_RESOLUTION = Resolution.FIXED;

    private static final Severity DEFAULT_SEVERITY = Severity.NONE;
    private static final Severity UPDATED_SEVERITY = Severity.NONE;

    private static final Priority DEFAULT_PRIORITY = Priority.MINOR;
    private static final Priority UPDATED_PRIORITY = Priority.MAJOR;

    private static final LocalDate DEFAULT_RECORDED = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_RECORDED = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_MODIFIED = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_MODIFIED = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_LICENSE = "AAAAAAAAAA";
    private static final String UPDATED_LICENSE = "BBBBBBBBBB";

    @Autowired
    private DefectRepository defectRepository;

    @Autowired
    private DefectSearchRepository defectSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDefectMockMvc;

    private Defect defect;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DefectResource defectResource = new DefectResource(defectRepository, defectSearchRepository);
        this.restDefectMockMvc = MockMvcBuilders.standaloneSetup(defectResource)
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
    public static Defect createEntity(EntityManager em) {
        Defect defect = new Defect()
            .ticket(DEFAULT_TICKET)
            .summary(DEFAULT_SUMMARY)
            .description(DEFAULT_DESCRIPTION)
            .status(DEFAULT_STATUS)
            .resolution(DEFAULT_RESOLUTION)
            .severity(DEFAULT_SEVERITY)
            .priority(DEFAULT_PRIORITY)
            .recorded(DEFAULT_RECORDED)
            .modified(DEFAULT_MODIFIED)
            .author(DEFAULT_AUTHOR)
            .license(DEFAULT_LICENSE);
        return defect;
    }

    @Before
    public void initTest() {
        defectSearchRepository.deleteAll();
        defect = createEntity(em);
    }

    @Test
    @Transactional
    public void createDefect() throws Exception {
        int databaseSizeBeforeCreate = defectRepository.findAll().size();

        // Create the Defect
        restDefectMockMvc.perform(post("/api/defects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(defect)))
            .andExpect(status().isCreated());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeCreate + 1);
        Defect testDefect = defectList.get(defectList.size() - 1);
        assertThat(testDefect.getTicket()).isEqualTo(DEFAULT_TICKET);
        assertThat(testDefect.getSummary()).isEqualTo(DEFAULT_SUMMARY);
        assertThat(testDefect.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDefect.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testDefect.getResolution()).isEqualTo(DEFAULT_RESOLUTION);
        assertThat(testDefect.getSeverity()).isEqualTo(DEFAULT_SEVERITY);
        assertThat(testDefect.getPriority()).isEqualTo(DEFAULT_PRIORITY);
        assertThat(testDefect.getRecorded()).isEqualTo(DEFAULT_RECORDED);
        assertThat(testDefect.getModified()).isEqualTo(DEFAULT_MODIFIED);
        assertThat(testDefect.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testDefect.getLicense()).isEqualTo(DEFAULT_LICENSE);

        // Validate the Defect in Elasticsearch
        Defect defectEs = defectSearchRepository.findOne(testDefect.getId());
        assertThat(defectEs).isEqualToIgnoringGivenFields(testDefect);
    }

    @Test
    @Transactional
    public void createDefectWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = defectRepository.findAll().size();

        // Create the Defect with an existing ID
        defect.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDefectMockMvc.perform(post("/api/defects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(defect)))
            .andExpect(status().isBadRequest());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllDefects() throws Exception {
        // Initialize the database
        defectRepository.saveAndFlush(defect);

        // Get all the defectList
        restDefectMockMvc.perform(get("/api/defects?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(defect.getId().intValue())))
            .andExpect(jsonPath("$.[*].ticket").value(hasItem(DEFAULT_TICKET.toString())))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].resolution").value(hasItem(DEFAULT_RESOLUTION.toString())))
            .andExpect(jsonPath("$.[*].severity").value(hasItem(DEFAULT_SEVERITY.toString())))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY.toString())))
            .andExpect(jsonPath("$.[*].recorded").value(hasItem(DEFAULT_RECORDED.toString())))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(DEFAULT_MODIFIED.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void getDefect() throws Exception {
        // Initialize the database
        defectRepository.saveAndFlush(defect);

        // Get the defect
        restDefectMockMvc.perform(get("/api/defects/{id}", defect.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(defect.getId().intValue()))
            .andExpect(jsonPath("$.ticket").value(DEFAULT_TICKET.toString()))
            .andExpect(jsonPath("$.summary").value(DEFAULT_SUMMARY.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.resolution").value(DEFAULT_RESOLUTION.toString()))
            .andExpect(jsonPath("$.severity").value(DEFAULT_SEVERITY.toString()))
            .andExpect(jsonPath("$.priority").value(DEFAULT_PRIORITY.toString()))
            .andExpect(jsonPath("$.recorded").value(DEFAULT_RECORDED.toString()))
            .andExpect(jsonPath("$.modified").value(DEFAULT_MODIFIED.toString()))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR.toString()))
            .andExpect(jsonPath("$.license").value(DEFAULT_LICENSE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDefect() throws Exception {
        // Get the defect
        restDefectMockMvc.perform(get("/api/defects/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDefect() throws Exception {
        // Initialize the database
        defectRepository.saveAndFlush(defect);
        defectSearchRepository.save(defect);
        int databaseSizeBeforeUpdate = defectRepository.findAll().size();

        // Update the defect
        Defect updatedDefect = defectRepository.findOne(defect.getId());
        // Disconnect from session so that the updates on updatedDefect are not directly saved in db
        em.detach(updatedDefect);
        updatedDefect
            .ticket(UPDATED_TICKET)
            .summary(UPDATED_SUMMARY)
            .description(UPDATED_DESCRIPTION)
            .status(UPDATED_STATUS)
            .resolution(UPDATED_RESOLUTION)
            .severity(UPDATED_SEVERITY)
            .priority(UPDATED_PRIORITY)
            .recorded(UPDATED_RECORDED)
            .modified(UPDATED_MODIFIED)
            .author(UPDATED_AUTHOR)
            .license(UPDATED_LICENSE);

        restDefectMockMvc.perform(put("/api/defects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDefect)))
            .andExpect(status().isOk());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeUpdate);
        Defect testDefect = defectList.get(defectList.size() - 1);
        assertThat(testDefect.getTicket()).isEqualTo(UPDATED_TICKET);
        assertThat(testDefect.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testDefect.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDefect.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testDefect.getResolution()).isEqualTo(UPDATED_RESOLUTION);
        assertThat(testDefect.getSeverity()).isEqualTo(UPDATED_SEVERITY);
        assertThat(testDefect.getPriority()).isEqualTo(UPDATED_PRIORITY);
        assertThat(testDefect.getRecorded()).isEqualTo(UPDATED_RECORDED);
        assertThat(testDefect.getModified()).isEqualTo(UPDATED_MODIFIED);
        assertThat(testDefect.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testDefect.getLicense()).isEqualTo(UPDATED_LICENSE);

        // Validate the Defect in Elasticsearch
        Defect defectEs = defectSearchRepository.findOne(testDefect.getId());
        assertThat(defectEs).isEqualToIgnoringGivenFields(testDefect);
    }

    @Test
    @Transactional
    public void updateNonExistingDefect() throws Exception {
        int databaseSizeBeforeUpdate = defectRepository.findAll().size();

        // Create the Defect

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDefectMockMvc.perform(put("/api/defects")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(defect)))
            .andExpect(status().isCreated());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDefect() throws Exception {
        // Initialize the database
        defectRepository.saveAndFlush(defect);
        defectSearchRepository.save(defect);
        int databaseSizeBeforeDelete = defectRepository.findAll().size();

        // Get the defect
        restDefectMockMvc.perform(delete("/api/defects/{id}", defect.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean defectExistsInEs = defectSearchRepository.exists(defect.getId());
        assertThat(defectExistsInEs).isFalse();

        // Validate the database is empty
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchDefect() throws Exception {
        // Initialize the database
        defectRepository.saveAndFlush(defect);
        defectSearchRepository.save(defect);

        // Search the defect
        restDefectMockMvc.perform(get("/api/_search/defects?query=id:" + defect.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(defect.getId().intValue())))
            .andExpect(jsonPath("$.[*].ticket").value(hasItem(DEFAULT_TICKET.toString())))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].resolution").value(hasItem(DEFAULT_RESOLUTION.toString())))
            .andExpect(jsonPath("$.[*].severity").value(hasItem(DEFAULT_SEVERITY.toString())))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY.toString())))
            .andExpect(jsonPath("$.[*].recorded").value(hasItem(DEFAULT_RECORDED.toString())))
            .andExpect(jsonPath("$.[*].modified").value(hasItem(DEFAULT_MODIFIED.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Defect.class);
        Defect defect1 = new Defect();
        defect1.setId(1L);
        Defect defect2 = new Defect();
        defect2.setId(defect1.getId());
        assertThat(defect1).isEqualTo(defect2);
        defect2.setId(2L);
        assertThat(defect1).isNotEqualTo(defect2);
        defect1.setId(null);
        assertThat(defect1).isNotEqualTo(defect2);
    }
}
