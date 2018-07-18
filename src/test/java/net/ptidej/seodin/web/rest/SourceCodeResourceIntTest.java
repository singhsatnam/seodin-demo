package net.ptidej.seodin.web.rest;

import net.ptidej.seodin.SeodinApp;

import net.ptidej.seodin.domain.SourceCode;
import net.ptidej.seodin.repository.SourceCodeRepository;
import net.ptidej.seodin.repository.search.SourceCodeSearchRepository;
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
import java.util.List;

import static net.ptidej.seodin.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import net.ptidej.seodin.domain.enumeration.ArtifactStatus;
/**
 * Test class for the SourceCodeResource REST controller.
 *
 * @see SourceCodeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SeodinApp.class)
public class SourceCodeResourceIntTest {

    private static final String DEFAULT_TAG = "AAAAAAAAAA";
    private static final String UPDATED_TAG = "BBBBBBBBBB";

    private static final String DEFAULT_URI = "AAAAAAAAAA";
    private static final String UPDATED_URI = "BBBBBBBBBB";

    private static final ArtifactStatus DEFAULT_STATUS = ArtifactStatus.PRIVATE;
    private static final ArtifactStatus UPDATED_STATUS = ArtifactStatus.SUBMITED;

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_LICENSE = "AAAAAAAAAA";
    private static final String UPDATED_LICENSE = "BBBBBBBBBB";

    @Autowired
    private SourceCodeRepository sourceCodeRepository;

    @Autowired
    private SourceCodeSearchRepository sourceCodeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSourceCodeMockMvc;

    private SourceCode sourceCode;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SourceCodeResource sourceCodeResource = new SourceCodeResource(sourceCodeRepository, sourceCodeSearchRepository);
        this.restSourceCodeMockMvc = MockMvcBuilders.standaloneSetup(sourceCodeResource)
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
    public static SourceCode createEntity(EntityManager em) {
        SourceCode sourceCode = new SourceCode()
            .tag(DEFAULT_TAG)
            .uri(DEFAULT_URI)
            .status(DEFAULT_STATUS)
            .author(DEFAULT_AUTHOR)
            .license(DEFAULT_LICENSE);
        return sourceCode;
    }

    @Before
    public void initTest() {
        sourceCodeSearchRepository.deleteAll();
        sourceCode = createEntity(em);
    }

    @Test
    @Transactional
    public void createSourceCode() throws Exception {
        int databaseSizeBeforeCreate = sourceCodeRepository.findAll().size();

        // Create the SourceCode
        restSourceCodeMockMvc.perform(post("/api/source-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sourceCode)))
            .andExpect(status().isCreated());

        // Validate the SourceCode in the database
        List<SourceCode> sourceCodeList = sourceCodeRepository.findAll();
        assertThat(sourceCodeList).hasSize(databaseSizeBeforeCreate + 1);
        SourceCode testSourceCode = sourceCodeList.get(sourceCodeList.size() - 1);
        assertThat(testSourceCode.getTag()).isEqualTo(DEFAULT_TAG);
        assertThat(testSourceCode.getUri()).isEqualTo(DEFAULT_URI);
        assertThat(testSourceCode.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testSourceCode.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testSourceCode.getLicense()).isEqualTo(DEFAULT_LICENSE);

        // Validate the SourceCode in Elasticsearch
        SourceCode sourceCodeEs = sourceCodeSearchRepository.findOne(testSourceCode.getId());
        assertThat(sourceCodeEs).isEqualToIgnoringGivenFields(testSourceCode);
    }

    @Test
    @Transactional
    public void createSourceCodeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sourceCodeRepository.findAll().size();

        // Create the SourceCode with an existing ID
        sourceCode.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSourceCodeMockMvc.perform(post("/api/source-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sourceCode)))
            .andExpect(status().isBadRequest());

        // Validate the SourceCode in the database
        List<SourceCode> sourceCodeList = sourceCodeRepository.findAll();
        assertThat(sourceCodeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllSourceCodes() throws Exception {
        // Initialize the database
        sourceCodeRepository.saveAndFlush(sourceCode);

        // Get all the sourceCodeList
        restSourceCodeMockMvc.perform(get("/api/source-codes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sourceCode.getId().intValue())))
            .andExpect(jsonPath("$.[*].tag").value(hasItem(DEFAULT_TAG.toString())))
            .andExpect(jsonPath("$.[*].uri").value(hasItem(DEFAULT_URI.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void getSourceCode() throws Exception {
        // Initialize the database
        sourceCodeRepository.saveAndFlush(sourceCode);

        // Get the sourceCode
        restSourceCodeMockMvc.perform(get("/api/source-codes/{id}", sourceCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(sourceCode.getId().intValue()))
            .andExpect(jsonPath("$.tag").value(DEFAULT_TAG.toString()))
            .andExpect(jsonPath("$.uri").value(DEFAULT_URI.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR.toString()))
            .andExpect(jsonPath("$.license").value(DEFAULT_LICENSE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSourceCode() throws Exception {
        // Get the sourceCode
        restSourceCodeMockMvc.perform(get("/api/source-codes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSourceCode() throws Exception {
        // Initialize the database
        sourceCodeRepository.saveAndFlush(sourceCode);
        sourceCodeSearchRepository.save(sourceCode);
        int databaseSizeBeforeUpdate = sourceCodeRepository.findAll().size();

        // Update the sourceCode
        SourceCode updatedSourceCode = sourceCodeRepository.findOne(sourceCode.getId());
        // Disconnect from session so that the updates on updatedSourceCode are not directly saved in db
        em.detach(updatedSourceCode);
        updatedSourceCode
            .tag(UPDATED_TAG)
            .uri(UPDATED_URI)
            .status(UPDATED_STATUS)
            .author(UPDATED_AUTHOR)
            .license(UPDATED_LICENSE);

        restSourceCodeMockMvc.perform(put("/api/source-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSourceCode)))
            .andExpect(status().isOk());

        // Validate the SourceCode in the database
        List<SourceCode> sourceCodeList = sourceCodeRepository.findAll();
        assertThat(sourceCodeList).hasSize(databaseSizeBeforeUpdate);
        SourceCode testSourceCode = sourceCodeList.get(sourceCodeList.size() - 1);
        assertThat(testSourceCode.getTag()).isEqualTo(UPDATED_TAG);
        assertThat(testSourceCode.getUri()).isEqualTo(UPDATED_URI);
        assertThat(testSourceCode.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSourceCode.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testSourceCode.getLicense()).isEqualTo(UPDATED_LICENSE);

        // Validate the SourceCode in Elasticsearch
        SourceCode sourceCodeEs = sourceCodeSearchRepository.findOne(testSourceCode.getId());
        assertThat(sourceCodeEs).isEqualToIgnoringGivenFields(testSourceCode);
    }

    @Test
    @Transactional
    public void updateNonExistingSourceCode() throws Exception {
        int databaseSizeBeforeUpdate = sourceCodeRepository.findAll().size();

        // Create the SourceCode

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSourceCodeMockMvc.perform(put("/api/source-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sourceCode)))
            .andExpect(status().isCreated());

        // Validate the SourceCode in the database
        List<SourceCode> sourceCodeList = sourceCodeRepository.findAll();
        assertThat(sourceCodeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSourceCode() throws Exception {
        // Initialize the database
        sourceCodeRepository.saveAndFlush(sourceCode);
        sourceCodeSearchRepository.save(sourceCode);
        int databaseSizeBeforeDelete = sourceCodeRepository.findAll().size();

        // Get the sourceCode
        restSourceCodeMockMvc.perform(delete("/api/source-codes/{id}", sourceCode.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean sourceCodeExistsInEs = sourceCodeSearchRepository.exists(sourceCode.getId());
        assertThat(sourceCodeExistsInEs).isFalse();

        // Validate the database is empty
        List<SourceCode> sourceCodeList = sourceCodeRepository.findAll();
        assertThat(sourceCodeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSourceCode() throws Exception {
        // Initialize the database
        sourceCodeRepository.saveAndFlush(sourceCode);
        sourceCodeSearchRepository.save(sourceCode);

        // Search the sourceCode
        restSourceCodeMockMvc.perform(get("/api/_search/source-codes?query=id:" + sourceCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sourceCode.getId().intValue())))
            .andExpect(jsonPath("$.[*].tag").value(hasItem(DEFAULT_TAG.toString())))
            .andExpect(jsonPath("$.[*].uri").value(hasItem(DEFAULT_URI.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SourceCode.class);
        SourceCode sourceCode1 = new SourceCode();
        sourceCode1.setId(1L);
        SourceCode sourceCode2 = new SourceCode();
        sourceCode2.setId(sourceCode1.getId());
        assertThat(sourceCode1).isEqualTo(sourceCode2);
        sourceCode2.setId(2L);
        assertThat(sourceCode1).isNotEqualTo(sourceCode2);
        sourceCode1.setId(null);
        assertThat(sourceCode1).isNotEqualTo(sourceCode2);
    }
}
