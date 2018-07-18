package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.TestCase;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the TestCase entity.
 */
public interface TestCaseSearchRepository extends ElasticsearchRepository<TestCase, Long> {
}
