package net.ptidej.seodin.repository.search;

import net.ptidej.seodin.domain.Audio;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Audio entity.
 */
public interface AudioSearchRepository extends ElasticsearchRepository<Audio, Long> {
}
