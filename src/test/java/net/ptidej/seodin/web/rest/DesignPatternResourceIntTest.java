package net.ptidej.seodin.web.rest;

import net.ptidej.seodin.SeodinApp;

import net.ptidej.seodin.domain.DesignPattern;
import net.ptidej.seodin.repository.DesignPatternRepository;
import net.ptidej.seodin.repository.search.DesignPatternSearchRepository;
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
 * Test class for the DesignPatternResource REST controller.
 *
 * @see DesignPatternResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SeodinApp.class)
public class DesignPatternResourceIntTest {

    private static final String DEFAULT_TAG = "AAAAAAAAAA";
    private static final String UPDATED_TAG = "BBBBBBBBBB";

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_XML_DESCRIPTOR = "AAAAAAAAAA";
    private static final String UPDATED_XML_DESCRIPTOR = "BBBBBBBBBB";

    private static final ArtifactStatus DEFAULT_STATUS = ArtifactStatus.PRIVATE;
    private static final ArtifactStatus UPDATED_STATUS = ArtifactStatus.SUBMITED;

    private static final String DEFAULT_LICENSE = "AAAAAAAAAA";
    private static final String UPDATED_LICENSE = "BBBBBBBBBB";

    @Autowired
    private DesignPatternRepository designPatternRepository;

    @Autowired
    private DesignPatternSearchRepository designPatternSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDesignPatternMockMvc;

    private DesignPattern designPattern;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DesignPatternResource designPatternResource = new DesignPatternResource(designPatternRepository, designPatternSearchRepository);
        this.restDesignPatternMockMvc = MockMvcBuilders.standaloneSetup(designPatternResource)
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
    public static DesignPattern createEntity(EntityManager em) {
        DesignPattern designPattern = new DesignPattern()
            .tag(DEFAULT_TAG)
            .author(DEFAULT_AUTHOR)
            .xmlDescriptor(DEFAULT_XML_DESCRIPTOR)
            .status(DEFAULT_STATUS)
            .license(DEFAULT_LICENSE);
        return designPattern;
    }

    @Before
    public void initTest() {
        designPatternSearchRepository.deleteAll();
        designPattern = createEntity(em);
    }

    @Test
    @Transactional
    public void createDesignPattern() throws Exception {
        int databaseSizeBeforeCreate = designPatternRepository.findAll().size();

        // Create the DesignPattern
        restDesignPatternMockMvc.perform(post("/api/design-patterns")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(designPattern)))
            .andExpect(status().isCreated());

        // Validate the DesignPattern in the database
        List<DesignPattern> designPatternList = designPatternRepository.findAll();
        assertThat(designPatternList).hasSize(databaseSizeBeforeCreate + 1);
        DesignPattern testDesignPattern = designPatternList.get(designPatternList.size() - 1);
        assertThat(testDesignPattern.getTag()).isEqualTo(DEFAULT_TAG);
        assertThat(testDesignPattern.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testDesignPattern.getXmlDescriptor()).isEqualTo(DEFAULT_XML_DESCRIPTOR);
        assertThat(testDesignPattern.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testDesignPattern.getLicense()).isEqualTo(DEFAULT_LICENSE);

        // Validate the DesignPattern in Elasticsearch
        DesignPattern designPatternEs = designPatternSearchRepository.findOne(testDesignPattern.getId());
        assertThat(designPatternEs).isEqualToIgnoringGivenFields(testDesignPattern);
    }

    @Test
    @Transactional
    public void createDesignPatternWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = designPatternRepository.findAll().size();

        // Create the DesignPattern with an existing ID
        designPattern.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDesignPatternMockMvc.perform(post("/api/design-patterns")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(designPattern)))
            .andExpect(status().isBadRequest());

        // Validate the DesignPattern in the database
        List<DesignPattern> designPatternList = designPatternRepository.findAll();
        assertThat(designPatternList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllDesignPatterns() throws Exception {
        // Initialize the database
        designPatternRepository.saveAndFlush(designPattern);

        // Get all the designPatternList
        restDesignPatternMockMvc.perform(get("/api/design-patterns?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(designPattern.getId().intValue())))
            .andExpect(jsonPath("$.[*].tag").value(hasItem(DEFAULT_TAG.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].xmlDescriptor").value(hasItem(DEFAULT_XML_DESCRIPTOR.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void getDesignPattern() throws Exception {
        // Initialize the database
        designPatternRepository.saveAndFlush(designPattern);

        // Get the designPattern
        restDesignPatternMockMvc.perform(get("/api/design-patterns/{id}", designPattern.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(designPattern.getId().intValue()))
            .andExpect(jsonPath("$.tag").value(DEFAULT_TAG.toString()))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR.toString()))
            .andExpect(jsonPath("$.xmlDescriptor").value(DEFAULT_XML_DESCRIPTOR.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.license").value(DEFAULT_LICENSE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDesignPattern() throws Exception {
        // Get the designPattern
        restDesignPatternMockMvc.perform(get("/api/design-patterns/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDesignPattern() throws Exception {
        // Initialize the database
        designPatternRepository.saveAndFlush(designPattern);
        designPatternSearchRepository.save(designPattern);
        int databaseSizeBeforeUpdate = designPatternRepository.findAll().size();

        // Update the designPattern
        DesignPattern updatedDesignPattern = designPatternRepository.findOne(designPattern.getId());
        // Disconnect from session so that the updates on updatedDesignPattern are not directly saved in db
        em.detach(updatedDesignPattern);
        updatedDesignPattern
            .tag(UPDATED_TAG)
            .author(UPDATED_AUTHOR)
            .xmlDescriptor(UPDATED_XML_DESCRIPTOR)
            .status(UPDATED_STATUS)
            .license(UPDATED_LICENSE);

        restDesignPatternMockMvc.perform(put("/api/design-patterns")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDesignPattern)))
            .andExpect(status().isOk());

        // Validate the DesignPattern in the database
        List<DesignPattern> designPatternList = designPatternRepository.findAll();
        assertThat(designPatternList).hasSize(databaseSizeBeforeUpdate);
        DesignPattern testDesignPattern = designPatternList.get(designPatternList.size() - 1);
        assertThat(testDesignPattern.getTag()).isEqualTo(UPDATED_TAG);
        assertThat(testDesignPattern.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testDesignPattern.getXmlDescriptor()).isEqualTo(UPDATED_XML_DESCRIPTOR);
        assertThat(testDesignPattern.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testDesignPattern.getLicense()).isEqualTo(UPDATED_LICENSE);

        // Validate the DesignPattern in Elasticsearch
        DesignPattern designPatternEs = designPatternSearchRepository.findOne(testDesignPattern.getId());
        assertThat(designPatternEs).isEqualToIgnoringGivenFields(testDesignPattern);
    }

    @Test
    @Transactional
    public void updateNonExistingDesignPattern() throws Exception {
        int databaseSizeBeforeUpdate = designPatternRepository.findAll().size();

        // Create the DesignPattern

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDesignPatternMockMvc.perform(put("/api/design-patterns")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(designPattern)))
            .andExpect(status().isCreated());

        // Validate the DesignPattern in the database
        List<DesignPattern> designPatternList = designPatternRepository.findAll();
        assertThat(designPatternList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDesignPattern() throws Exception {
        // Initialize the database
        designPatternRepository.saveAndFlush(designPattern);
        designPatternSearchRepository.save(designPattern);
        int databaseSizeBeforeDelete = designPatternRepository.findAll().size();

        // Get the designPattern
        restDesignPatternMockMvc.perform(delete("/api/design-patterns/{id}", designPattern.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean designPatternExistsInEs = designPatternSearchRepository.exists(designPattern.getId());
        assertThat(designPatternExistsInEs).isFalse();

        // Validate the database is empty
        List<DesignPattern> designPatternList = designPatternRepository.findAll();
        assertThat(designPatternList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchDesignPattern() throws Exception {
        // Initialize the database
        designPatternRepository.saveAndFlush(designPattern);
        designPatternSearchRepository.save(designPattern);

        // Search the designPattern
        restDesignPatternMockMvc.perform(get("/api/_search/design-patterns?query=id:" + designPattern.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(designPattern.getId().intValue())))
            .andExpect(jsonPath("$.[*].tag").value(hasItem(DEFAULT_TAG.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].xmlDescriptor").value(hasItem(DEFAULT_XML_DESCRIPTOR.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DesignPattern.class);
        DesignPattern designPattern1 = new DesignPattern();
        designPattern1.setId(1L);
        DesignPattern designPattern2 = new DesignPattern();
        designPattern2.setId(designPattern1.getId());
        assertThat(designPattern1).isEqualTo(designPattern2);
        designPattern2.setId(2L);
        assertThat(designPattern1).isNotEqualTo(designPattern2);
        designPattern1.setId(null);
        assertThat(designPattern1).isNotEqualTo(designPattern2);
    }
}
