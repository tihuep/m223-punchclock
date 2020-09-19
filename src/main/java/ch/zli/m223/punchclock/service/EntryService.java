package ch.zli.m223.punchclock.service;

import ch.zli.m223.punchclock.domain.Entry;
import ch.zli.m223.punchclock.domain.EntryNullAllowed;
import ch.zli.m223.punchclock.repository.EntryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EntryService {
    private EntryRepository entryRepository;

    public EntryService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    public Entry createEntry(Entry entry) {
        return entryRepository.saveAndFlush(entry);
    }

    public void deleteEntry(Long id) {
        List<Entry> entries = entryRepository.findAll();
        for (Entry entry: entries) {
            if (entry.getId() == id){
                entryRepository.delete(entry);
            }
        }
    }

    public Entry updateEntry(Entry entry, Long id) {
        entry.setId(id);
        return entryRepository.saveAndFlush(entry);
    }

    public Entry updateEntryPatch(EntryNullAllowed entry, Long id) {
        List<Entry> entries = entryRepository.findAll();
        for (Entry entry1 : entries) {
            if (entry1.getId() == id){
                Entry newEntry = new Entry();
                newEntry.setId(id);
                newEntry.setCheckIn(entry.getCheckIn() == null ? entry1.getCheckIn() : entry.getCheckIn());
                newEntry.setCheckOut(entry.getCheckOut() == null ? entry1.getCheckOut() : entry.getCheckOut());
                return entryRepository.saveAndFlush(newEntry);
            }
        }
        throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
    }

    public List<Entry> findAll() {
        return entryRepository.findAll();
    }
}
