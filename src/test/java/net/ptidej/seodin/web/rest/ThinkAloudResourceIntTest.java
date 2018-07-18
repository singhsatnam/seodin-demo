package net.ptidej.seodin.web.rest;

import net.ptidej.seodin.SeodinApp;

import net.ptidej.seodin.domain.ThinkAloud;
import net.ptidej.seodin.repository.ThinkAloudRepository;
import net.ptidej.seodin.repository.search.ThinkAloudSearchRepository;
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
 * Test class for the ThinkAloudResource REST controller.
 *
 * @see ThinkAloudResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SeodinApp.class)
public class ThinkAloudResourceIntTest {

    private static final String DEFAULT_TAG = "AAAAAAAAAA";
    private static final String UPDATED_TAG = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_LICENSE = "AAAAAAAAAA";
    private static final String UPDATED_LICENSE = "BBBBBBBBBB";

    @Autowired
    private ThinkAloudRepository thinkAloudRepository;

    @Autowired
    private ThinkAloudSearchRepository thinkAloudSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restThinkAloudMockMvc;

    private ThinkAloud thinkAloud;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ThinkAloudResource thinkAloudResource = new ThinkAloudResource(thinkAloudRepository, thinkAloudSearchRepository);
        this.restThinkAloudMockMvc = MockMvcBuilders.standaloneSetup(thinkAloudResource)
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
    public static ThinkAloud createEntity(EntityManager em) {
        ThinkAloud thinkAloud = new ThinkAloud()
            .tag(DEFAULT_TAG)
            .description(DEFAULT_DESCRIPTION)
            .author(DEFAULT_AUTHOR)
            .license(DEFAULT_LICENSE);
        return thinkAloud;
    }

    @Before
    public void initTest() {
        thinkAloudSearchRepository.deleteAll();
        thinkAloud = createEntity(em);
    }

    @Test
    @Transactional
    public void createThinkAloud() throws Exception {
        int databaseSizeBeforeCreate = thinkAloudRepository.findAll().size();

        // Create the ThinkAloud
        restThinkAloudMockMvc.perform(post("/api/think-alouds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(thinkAloud)))
            .andExpect(status().isCreated());

        // Validate the ThinkAloud in the database
        List<ThinkAloud> thinkAloudList = thinkAloudRepository.findAll();
        assertThat(thinkAloudList).hasSize(databaseSizeBeforeCreate + 1);
        ThinkAloud testThinkAloud = thinkAloudList.get(thinkAloudList.size() - 1);
        assertThat(testThinkAloud.getTag()).isEqualTo(DEFAULT_TAG);
        assertThat(testThinkAloud.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testThinkAloud.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testThinkAloud.getLicense()).isEqualTo(DEFAULT_LICENSE);

        // Validate the ThinkAloud in Elasticsearch
        ThinkAloud thinkAloudEs = thinkAloudSearchRepository.findOne(testThinkAloud.getId());
        assertThat(thinkAloudEs).isEqualToIgnoringGivenFields(testThinkAloud);
    }

    @Test
    @Transactional
    public void createThinkAloudWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = thinkAloudRepository.findAll().size();

        // Create the ThinkAloud with an existing ID
        thinkAloud.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restThinkAloudMockMvc.perform(post("/api/think-alouds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(thinkAloud)))
            .andExpect(status().isBadRequest());

        // Validate the ThinkAloud in the database
        List<ThinkAloud> thinkAloudList = thinkAloudRepository.findAll();
        assertThat(thinkAloudList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllThinkAlouds() throws Exception {
        // Initialize the database
        thinkAloudRepository.saveAndFlush(thinkAloud);

        // Get all the thinkAloudList
        restThinkAloudMockMvc.perform(get("/api/think-alouds?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(thinkAloud.getId().intValue())))
            .andExpect(jsonPath("$.[*].tag").value(hasItem(DEFAULT_TAG.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void getThinkAloud() throws Exception {
        // Initialize the database
        thinkAloudRepository.saveAndFlush(thinkAloud);

        // Get the thinkAloud
        restThinkAloudMockMvc.perform(get("/api/think-alouds/{id}", thinkAloud.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(thinkAloud.getId().intValue()))
            .andExpect(jsonPath("$.tag").value(DEFAULT_TAG.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR.toString()))
            .andExpect(jsonPath("$.license").value(DEFAULT_LICENSE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingThinkAloud() throws Exception {
        // Get the thinkAloud
        restThinkAloudMockMvc.perform(get("/api/think-alouds/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateThinkAloud() throws Exception {
        // Initialize the database
        thinkAloudRepository.saveAndFlush(thinkAloud);
        thinkAloudSearchRepository.save(thinkAloud);
        int databaseSizeBeforeUpdate = thinkAloudRepository.findAll().size();

        // Update the thinkAloud
        ThinkAloud updatedThinkAloud = thinkAloudRepository.findOne(thinkAloud.getId());
        // Disconnect from session so that the updates on updatedThinkAloud are not directly saved in db
        em.detach(updatedThinkAloud);
        updatedThinkAloud
            .tag(UPDATED_TAG)
            .description(UPDATED_DESCRIPTION)
            .author(UPDATED_AUTHOR)
            .license(UPDATED_LICENSE);

        restThinkAloudMockMvc.perform(put("/api/think-alouds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedThinkAloud)))
            .andExpect(status().isOk());

        // Validate the ThinkAloud in the database
        List<ThinkAloud> thinkAloudList = thinkAloudRepository.findAll();
        assertThat(thinkAloudList).hasSize(databaseSizeBeforeUpdate);
        ThinkAloud testThinkAloud = thinkAloudList.get(thinkAloudList.size() - 1);
        assertThat(testThinkAloud.getTag()).isEqualTo(UPDATED_TAG);
        assertThat(testThinkAloud.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testThinkAloud.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testThinkAloud.getLicense()).isEqualTo(UPDATED_LICENSE);

        // Validate the ThinkAloud in Elasticsearch
        ThinkAloud thinkAloudEs = thinkAloudSearchRepository.findOne(testThinkAloud.getId());
        assertThat(thinkAloudEs).isEqualToIgnoringGivenFields(testThinkAloud);
    }

    @Test
    @Transactional
    public void updateNonExistingThinkAloud() throws Exception {
        int databaseSizeBeforeUpdate = thinkAloudRepository.findAll().size();

        // Create the ThinkAloud

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restThinkAloudMockMvc.perform(put("/api/think-alouds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(thinkAloud)))
            .andExpect(status().isCreated());

        // Validate the ThinkAloud in the database
        List<ThinkAloud> thinkAloudList = thinkAloudRepository.findAll();
        assertThat(thinkAloudList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteThinkAloud() throws Exception {
        // Initialize the database
        thinkAloudRepository.saveAndFlush(thinkAloud);
        thinkAloudSearchRepository.save(thinkAloud);
        int databaseSizeBeforeDelete = thinkAloudRepository.findAll().size();

        // Get the thinkAloud
        restThinkAloudMockMvc.perform(delete("/api/think-alouds/{id}", thinkAloud.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean thinkAloudExistsInEs = thinkAloudSearchRepository.exists(thinkAloud.getId());
        assertThat(thinkAloudExistsInEs).isFalse();

        // Validate the database is empty
        List<ThinkAloud> thinkAloudList = thinkAloudRepository.findAll();
        assertThat(thinkAloudList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchThinkAloud() throws Exception {
        // Initialize the database
        thinkAloudRepository.saveAndFlush(thinkAloud);
        thinkAloudSearchRepository.save(thinkAloud);

        // Search the thinkAloud
        restThinkAloudMockMvc.perform(get("/api/_search/think-alouds?query=id:" + thinkAloud.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(thinkAloud.getId().intValue())))
            .andExpect(jsonPath("$.[*].tag").value(hasItem(DEFAULT_TAG.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].license").value(hasItem(DEFAULT_LICENSE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ThinkAloud.class);
        ThinkAloud thinkAloud1 = new ThinkAloud();
        thinkAloud1.setId(1L);
        ThinkAloud thinkAloud2 = new ThinkAloud();
        thinkAloud2.setId(thinkAloud1.getId());
        assertThat(thinkAloud1).isEqualTo(thinkAloud2);
        thinkAloud2.setId(2L);
        assertThat(thinkAloud1).isNotEqualTo(thinkAloud2);
        thinkAloud1.setId(null);
        assertThat(thinkAloud1).isNotEqualTo(thinkAloud2);
    }
}
