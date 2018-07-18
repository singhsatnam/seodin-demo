package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.Script;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Script entity.
 */
public interface ScriptSearchRepository extends ElasticsearchRepository<Script, Long> {
}
