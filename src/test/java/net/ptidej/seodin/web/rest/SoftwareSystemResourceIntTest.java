package net.ptidej.seodin.web.rest;

import net.ptidej.seodin.SeodinApp;

import net.ptidej.seodin.domain.SoftwareSystem;
import net.ptidej.seodin.repository.SoftwareSystemRepository;
import net.ptidej.seodin.repository.search.SoftwareSystemSearchRepository;
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

/**
 * Test class for the SoftwareSystemResource REST controller.
 *
 * @see SoftwareSystemResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SeodinApp.class)
public class SoftwareSystemResourceIntTest {

    private static final String DEFAULT_TAG = "AAAAAAAAAA";
    private static final String UPDATED_TAG = "BBBBBBBBBB";

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_LICENSE = "AAAAAAAAAA";
    private static final String UPDATED_LICENSE = "BBBBBBBBBB";

    @Autowired
    private SoftwareSystemRepository softwareSystemRepository;

    @Autowired
    private SoftwareSystemSearchRepository softwareSystemSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSoftwareSystemMockMvc;

    private SoftwareSystem softwareSystem;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SoftwareSystemResource softwareSystemResource = new SoftwareSystemResource(softwareSystemRepository, softwareSystemSearchRepository);
        this.restSoftwareSystemMockMvc = MockMvcBuilders.standaloneSetup(softwareSystemResource)
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
    public static SoftwareSystem createEntity(EntityManager em) {
        SoftwareSystem softwareSystem = new SoftwareSystem()
            .tag(DEFAULT_TAG)
            .author(DEFAULT_AUTHOR)
            .license(DEFAULT_LICENSE);
        return softwareSystem;
    }

    @Before
    public void initTest() {
        softwareSystemSearchRepository.deleteAll();
        softwareSystem = createEntity(em);
    }

    @Test
    @Transactional
    public void createSoftwareSystem() throws Exception {
        int databaseSizeBeforeCreate = softwareSystemRepository.findAll().size();

        // Create the SoftwareSystem
        restSoftwareSystemMockMvc.perform(post("/api/software-systems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(softwareSystem)))
            .andExpect(status().isCreated());

        // Validate the SoftwareSystem in the database
        List<SoftwareSystem> softwareSystemList = softwareSystemRepository.findAll();
        assertThat(softwareSystemList).hasSize(databaseSizeBeforeCreate + 1);
        SoftwareSystem testSoftwareSystem = softwareSystemList.get(softwareSystemList.size() - 1);
        assertThat(testSoftwareSystem.getTag()).isEqualTo(DEFAULT_TAG);
        assertThat(testSoftwareSystem.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testSoftwareSystem.getLicense()).isEqualTo(DEFAULT_LICENSE);

        // Validate the SoftwareSystem in Elasticsearch
        SoftwareSystem softwareSystemEs = softwareSystemSearchRepository.findOne(testSoftwareSystem.getId());
        assertThat(softwareSystemEs).isEqualToIgnoringGivenFields(testSoftwareSystem);
    }

    @Test
    @Transactional
    public void createSoftwareSystemWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = softwareSystemRepository.findAll().size();

        // Create the SoftwareSystem with an existing ID
        softwareSystem.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSoftwareSystemMockMvc.perform(post("/api/software-systems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(softwareSystem)))
            .andExpect(status().isBadRequest());

        // Validate the SoftwareSystem in the database
        List<SoftwareSystem> softwareSystemList = softwareSystemRepository.findAll();
        assertThat(softwareSystemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllSoftwareSystems() throws Exception {
        // Initialize the database
        softwareSystemRepository.saveAndFlush(softwareSystem);

        // Get all the softwareSystemList
        restSoftwareSystemMockMvc.perform(get("/api/software-systems?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(softwareSystem.getId().intValue())))
            .andExpect(jsonPath("$.[*].tag").value(hasItem(DEFAULT_TAG.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void getSoftwareSystem() throws Exception {
        // Initialize the database
        softwareSystemRepository.saveAndFlush(softwareSystem);

        // Get the softwareSystem
        restSoftwareSystemMockMvc.perform(get("/api/software-systems/{id}", softwareSystem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(softwareSystem.getId().intValue()))
            .andExpect(jsonPath("$.tag").value(DEFAULT_TAG.toString()))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR.toString()))
            .andExpect(jsonPath("$.license").value(DEFAULT_LICENSE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSoftwareSystem() throws Exception {
        // Get the softwareSystem
        restSoftwareSystemMockMvc.perform(get("/api/software-systems/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSoftwareSystem() throws Exception {
        // Initialize the database
        softwareSystemRepository.saveAndFlush(softwareSystem);
        softwareSystemSearchRepository.save(softwareSystem);
        int databaseSizeBeforeUpdate = softwareSystemRepository.findAll().size();

        // Update the softwareSystem
        SoftwareSystem updatedSoftwareSystem = softwareSystemRepository.findOne(softwareSystem.getId());
        // Disconnect from session so that the updates on updatedSoftwareSystem are not directly saved in db
        em.detach(updatedSoftwareSystem);
        updatedSoftwareSystem
            .tag(UPDATED_TAG)
            .author(UPDATED_AUTHOR)
            .license(UPDATED_LICENSE);

        restSoftwareSystemMockMvc.perform(put("/api/software-systems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSoftwareSystem)))
            .andExpect(status().isOk());

        // Validate the SoftwareSystem in the database
        List<SoftwareSystem> softwareSystemList = softwareSystemRepository.findAll();
        assertThat(softwareSystemList).hasSize(databaseSizeBeforeUpdate);
        SoftwareSystem testSoftwareSystem = softwareSystemList.get(softwareSystemList.size() - 1);
        assertThat(testSoftwareSystem.getTag()).isEqualTo(UPDATED_TAG);
        assertThat(testSoftwareSystem.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testSoftwareSystem.getLicense()).isEqualTo(UPDATED_LICENSE);

        // Validate the SoftwareSystem in Elasticsearch
        SoftwareSystem softwareSystemEs = softwareSystemSearchRepository.findOne(testSoftwareSystem.getId());
        assertThat(softwareSystemEs).isEqualToIgnoringGivenFields(testSoftwareSystem);
    }

    @Test
    @Transactional
    public void updateNonExistingSoftwareSystem() throws Exception {
        int databaseSizeBeforeUpdate = softwareSystemRepository.findAll().size();

        // Create the SoftwareSystem

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSoftwareSystemMockMvc.perform(put("/api/software-systems")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(softwareSystem)))
            .andExpect(status().isCreated());

        // Validate the SoftwareSystem in the database
        List<SoftwareSystem> softwareSystemList = softwareSystemRepository.findAll();
        assertThat(softwareSystemList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSoftwareSystem() throws Exception {
        // Initialize the database
        softwareSystemRepository.saveAndFlush(softwareSystem);
        softwareSystemSearchRepository.save(softwareSystem);
        int databaseSizeBeforeDelete = softwareSystemRepository.findAll().size();

        // Get the softwareSystem
        restSoftwareSystemMockMvc.perform(delete("/api/software-systems/{id}", softwareSystem.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean softwareSystemExistsInEs = softwareSystemSearchRepository.exists(softwareSystem.getId());
        assertThat(softwareSystemExistsInEs).isFalse();

        // Validate the database is empty
        List<SoftwareSystem> softwareSystemList = softwareSystemRepository.findAll();
        assertThat(softwareSystemList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSoftwareSystem() throws Exception {
        // Initialize the database
        softwareSystemRepository.saveAndFlush(softwareSystem);
        softwareSystemSearchRepository.save(softwareSystem);

        // Search the softwareSystem
        restSoftwareSystemMockMvc.perform(get("/api/_search/software-systems?query=id:" + softwareSystem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(softwareSystem.getId().intValue())))
            .andExpect(jsonPath("$.[*].tag").value(hasItem(DEFAULT_TAG.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SoftwareSystem.class);
        SoftwareSystem softwareSystem1 = new SoftwareSystem();
        softwareSystem1.setId(1L);
        SoftwareSystem softwareSystem2 = new SoftwareSystem();
        softwareSystem2.setId(softwareSystem1.getId());
        assertThat(softwareSystem1).isEqualTo(softwareSystem2);
        softwareSystem2.setId(2L);
        assertThat(softwareSystem1).isNotEqualTo(softwareSystem2);
        softwareSystem1.setId(null);
        assertThat(softwareSystem1).isNotEqualTo(softwareSystem2);
    }
}
